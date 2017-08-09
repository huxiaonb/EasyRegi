import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Positions extends React.Component{
    state = {
        locationFlag : false,
        geolocation : {},
        nearbyPositions : [],
        isLocationExist: false
    }
    constructAddrByLocation(info){
        let addrArr = [], addr = '';
        if(info != null && info != undefined){
            if(info.province != null && info.province != undefined && info.province != '')
                addrArr.push(info.province);
            if(info.city != null && info.city != undefined && info.city != '')
                addrArr.push(info.city);
            if(info.district != null && info.district != undefined && info.district != '')
                addrArr.push(info.district);
        }
        addr = addrArr.join(' ');
        return addr;
    }
    async componentWillReceiveProps(nextProps){
        let info = !!nextProps ?　nextProps.args : '';　
        if(!info || info.addr === ''){
            this.setState({
                locationFlag : true
            });
        }else if(!!nextProps){
            this.setState({
                geolocation : nextProps.args,
                isLocationExist: true
            });
            let addr = this.constructAddrByLocation(info);
            let re = {};
            if(addr != '')
                re = await lapi.findNearbyPositions(addr);
                // re = await lapi.findAllPositions();
            console.log(re);
            if(re != null && re != undefined && re.positions != null && re.positions != undefined){
                this.setState({
                    nearbyPositions: re.positions
                });
            }
        }
    }
    async componentWillMount(){
        //console.log('componentWillMount')
        //alert('2');
        let info = this.props.args;
        //未成功获取位置信息
        //alert(JSON.stringify(this.props.args));
        if(!info ){
            //alert('4');
            this.setState({
                locationFlag : true
            });
        }else{
            //alert('3');
            let re = {};
            let addr = this.constructAddrByLocation(info);;
            if(addr != ''){
                Toast.loading('Loading...', 0);
                re = await lapi.findNearbyPositions(addr);
            }
                
                // re = await lapi.findAllPositions();
            //console.log(re);
            if(info){
                this.setState({
                    geolocation : info,
                    isLocationExist: true
                });
            }
            if(re != null && re != undefined && re.positions != null && re.positions != undefined){
                this.setState({
                    nearbyPositions: re.positions,
                    locationFlag :　false,
                });
                Toast.hide();
            }
        }
        
        //get position List
    }
    render(){
        let {geolocation, nearbyPositions, isLocationExist,locationFlag} = this.state;
        // let location = JSON.stringify(geolocation)
        if(locationFlag){
            return (
            <div className="result-example">
                <Result style={{height:'500px',marginTop:'30%'}}
                    img={<Icon type="exclamation-circle" className="icon" style={{ fill: '#FFC600' }} />}
                    message="未能获取到位置信息，无法显示周边招聘信息"
                />                
            </div>)
        }

        let addr = '';
        if(geolocation != null && geolocation != undefined)
            addr =  geolocation.nation + ',' + geolocation.province + ',' + geolocation.city + ',' +  geolocation.district + ',' + geolocation.addr;
        let positionPanelLists = [];
        if(nearbyPositions != null && nearbyPositions != undefined) {
            nearbyPositions.map((ele, idx)=>{
                let headerName = ele.name;
                const positionPanelItem = (
                    <Accordion.Panel header={headerName} key={`position_${ele._id}`}>
                        <List>
                            <InputItem
                            name="companyName"
                            placeholder=""
                            value={ele.companyName}
                            disabled>公司</InputItem>
                            <InputItem
                            name="salary"
                            placeholder=""
                            value={ele.salary}
                            disabled>薪资</InputItem>
                            <InputItem
                            name="totalRecruiters"
                            placeholder=""
                            value={ele.totalRecruiters}
                            disabled>招聘人数</InputItem>
                            <InputItem
                            name="phoneNumber"
                            placeholder=""
                            value={ele.phoneNumber}
                            disabled>联系电话</InputItem>
                            <TextareaItem
                                name="positionDesc"
                                value={ele.positionDesc}
                                placeholder=""
                                title="岗位描述"
                                rows={5}
                                disabled
                            />
                        </List>
                    </Accordion.Panel>
                );
                positionPanelLists.push(positionPanelItem);
            });
        }
        return(
            <div className='ant-layout'>
                <div className='ant-layout-header' style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >附近的职位</div>
                <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'left'}}>
                        <div className='curr-geo'>
                        <span>当前位置：{addr.split(',').pop()}</span>
                        </div>
                        
                        {/*<Accordion>
                            <Accordion.Panel header="对象" className="">api返回对象：{location}</Accordion.Panel>
                        </Accordion>*/}
                        <Accordion>
                            {positionPanelLists}
                        </Accordion>
                    </div>
                </div>
                <div className='ant-layout-footer' style={{ textAlign: 'center',fontSize: '34px' }}>
                    Copyright ©2017 深圳云轻微创科技有限公司 粤ICP备12044479号-3 
                </div>
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Positions args = { args } />, this);})
}