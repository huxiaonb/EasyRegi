import React from 'react'
import { render } from 'react-dom'
import {Input, Select, message} from 'antd'
import api from '../apiCollect';
const Option = Select.Option;
export default class DistrictSelect extends React.Component{
    state = {
        pData: [],
        pValue: '北京市',
        cValue : '市辖区',
        cData: [],
        thirdValue : '东城区',
        thdData: [],
        persit:{
            provinces : [],
            citys : [],
            areas : []
        }
    }
    async getInitialData(){
        let r = await api.getAllProvinces();
        let data = await r.json();
        if(data.success){
            let args = 'label='+ '北京市';
            let r = await api.getNextGradeDistricts(args);
            let sdata = await r.json();
            if(sdata.success){
                let args = 'label='+ '市辖区' + '&&parentLabel=' + '北京市';
                let r = await api.getNextGradeDistricts(args);
                let tdata = await r.json();
                if(tdata.success){
                    this.setState({
                        persist : {
                            provinces : data.provinces,
                            citys : sdata.childrens,
                            areas : tdata.childrens
                        },
                        pData : data.provinces,
                        cData : sdata.childrens,
                        thdData : tdata.childrens
                    })
                }
            }
            
        }else if(data.errmsg){
            message.error(data.errmsg);
        }else{
            message.error('未知错误请联系管理员!')
        }
    }
    filterProvince(value){
        //空值点叉叉需要由此判断 以下同理
        if(!value){
            value = ''
        }
        let localData = [...this.state.persist.provinces];
        
        this.setState({
            pValue : value ? value.split('(')[0] : value,
            pData : localData.filter(p=>(!!~p.label.indexOf(value) || !!~p.value.indexOf(value)))
        })
    }
    filterSecCity(value){
        if(!value){
            value = ''
        }
        let localData = this.state.persist.citys ? [...this.state.persist.citys] : [];
        
        this.setState({
            cValue : value ? value.split('(')[0] : value,
            cData : localData.filter(p=>(!!~p.label.indexOf(value) || !!~p.value.indexOf(value)))
        })
    }
    filterThdCity(value){
        if(!value){
            value = ''
        }
        let localData = this.state.persist.areas ? [...this.state.persist.areas] : [];
        
        this.setState({
            thirdValue : value ? value.split('(')[0] : value,
            thdData : localData.filter(p=>(!!~p.label.indexOf(value) || !!~p.value.indexOf(value)))
        })
    }
    
    async getSecChildren(value){
        this.setState({pValue:value.split('(')[0]});
        let args = 'label='+ value.split('(')[0];
        let r = await api.getNextGradeDistricts(args);
        let data = await r.json();
        if(data.success){
            this.setState({
                cData : data.childrens,
                thdData :[],
                persist : {
                    provinces : this.state.persist.provinces,
                    citys : data.childrens
                },
                cValue : '',
                thirdValue : ''
            })
        }else if(data.errmsg){
            message.error(data.errmsg); 
        }else{
            message.error('未知错误请联系管理员!')
        }
    }

    async getThdChildren(value){
        let {pValue} = this.state;
        this.setState({cValue:value.split('(')[0]});
        let args = 'label='+ value.split('(')[0] + '&&parentLabel=' + pValue
        let r = await api.getNextGradeDistricts(args);
        let data = await r.json();
        if(data.success){
            this.setState({
                thdData : data.childrens,
                persist : Object.assign(this.state.persist,{
                    areas : data.childrens
                }),
                thirdValue : ''
            });
        }else if(data.errmsg){
            message.error(data.errmsg);
        }else{
            message.error('未知错误请联系管理员!')
        }
    }

    async componentWillMount(){
        await this.getInitialData()
    }
    render(){
        const { pData, pValue, cValue, cData, thirdValue, thdData } = this.state;
        return(
            <div>
                <span >省：</span>
                                    <Select
                                        mode="combobox"
                                        filterOption={false}
                                        value={this.state.pValue}
                                        size='large'
                                        allowClear
                                        placeholder="选择省份"
                                        style={{width:'20%'}}
                                        defaultActiveFirstOption={true}
                                        onChange={this.filterProvince.bind(this)}
                                        onSelect={this.getSecChildren.bind(this)}
                                        >
                                        {pData.map(d => <Option key={`${d.label}(${d.value})`}>{d.label}</Option>)}
                                    </Select>
                                    <span style={{paddingLeft : '10px'}}>市：</span>
                                    <Select
                                        mode="combobox"
                                        value={this.state.cValue}
                                        size='large'
                                        allowClear
                                        placeholder="选择城市"
                                        defaultActiveFirstOption={true}
                                        style={{width:'20%'}}                             
                                        onSelect={this.getThdChildren.bind(this)}
                                        onChange={this.filterSecCity.bind(this)}
                                        >
                                        {cData.map(d => <Option key={`${d.label}(${d.value})`}>{d.label}</Option>)}
                                    </Select>
                                    <span style={{paddingLeft : '10px'}}>县/区：</span>
                                    <Select
                                        mode="combobox"
                                        value={this.state.thirdValue}
                                        size='large'
                                        placeholder="选择县区" 
                                        allowClear
                                        defaultActiveFirstOption={true}
                                        style={{width:'20%'}}                                 
                                        onChange={this.filterThdCity.bind(this)}
                                        >
                                        {thdData.map(d => <Option key={`${d.label}(${d.value})`}>{d.label}</Option>)}
                                    </Select>
            </div>
        )
    }
}