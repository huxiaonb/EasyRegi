import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Tag,Button} from 'antd-mobile';

import lapi from './registerProfile/lapi'
import './less/basic.less'


const tagContet = ['无经验', '电子五金', '模具塑胶', '纺织玩具', '文员行政', '后勤维修', '印刷宣传', '运输装卸', '销售客服', '建筑装潢','财务出纳', '采购跟单'];
export default class BasicView extends React.Component{
    
    // async componentWillMount(){
    //     let openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
    //     let r = await lapi.getApplicant(openId);
    //     console.log('rrrr',r);
    //     if(r && r.length){
    //         this.setState({
    //             info : r[0]
    //         })
    //     }
    // }
    render(){
        let {info, onEdit} = this.props;
        let tagOptions = [];
        if(info.skill.length){
            info.skill.map(s=>{
                tagOptions.push(tagContet[s] + ',');
            })
        }
        return(
            <div style={{margin : '20px 20px', background : '#fff',position :'fixed', height : '100%',width:'100%'}}>
                <h2 className='basic-h2'>微简历预览</h2>
                <div style={{margin : '60px 30px'}}>
                <div className='ant-row ant-form-item item-padd'>
                    <div className='ant-col-8 ant-form-item-label'>
                        <label className='am-input-label'>姓名</label>
                    </div>
                    <div className='ant-col-14 ant-form-item-control-wrapper'>
                        <span>{info.name}</span>
                    </div>
                </div>
                    <div className='ant-row ant-form-item item-padd'>
                        <div className='ant-col-8 ant-form-item-label'>
                            <label className='am-input-label'>电话</label>
                        </div>
                        <div className='ant-col-14 ant-form-item-control-wrapper'>
                            <span>{info.mobile}</span>
                        </div>
                    </div>
                <div className='ant-row ant-form-item item-padd'>
                    <div className='ant-col-8 ant-form-item-label'>
                        <label>身份证号</label>
                    </div>
                    <div className='ant-col-14 ant-form-item-control-wrapper'>
                        <span>{info.idCardNumber}</span>
                    </div>
                </div>
                <div className='ant-row ant-form-item item-padd'>
                    <div className='ant-col-8 ant-form-item-label'>
                        <label>现住址</label>
                    </div>
                    <div className='ant-col-14 ant-form-item-control-wrapper'>
                        <span>{info.currentAddress}</span>
                    </div>
                </div>
                <div className='ant-row ant-form-item item-padd'>
                    <div className='ant-col-8 ant-form-item-label'>
                        <label >最高学历</label>
                    </div>
                    <div className='ant-col-14 ant-form-item-control-wrapper'>
                        <span>{info.highestDegree}</span>
                    </div>
                </div>
                <div className='ant-row ant-form-item item-padd'>
                    <div className='ant-col-8 ant-form-item-label'>
                        <label>技能&经验</label>
                    </div>
                    <div className='ant-col-14 ant-form-item-control-wrapper'>
                        {tagOptions}
                    </div>
                </div>
                <Button className='btn-padd' type="primary" onClick={onEdit}>编辑</Button>
                </div>
            </div>
        )
    }
}