import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Steps from './Steps/Basic';

import Step1 from './basicInfo/step1';
import Step2 from './basicInfo/step2';
import Step3 from './basicInfo/step3'

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/basic.less'

const Item = List.Item;
const Brief = Item.Brief;
const step_data=[{
        "text": "手机验证",
        "activeItem": true,
    },
    {
        "text": "实名验证",
        "activeItem": false,
    },
    {
        "text": "学历特长",
        "activeItem": false,
    },
    ]
export default class BasicForm extends React.Component{
    state={
        step : 1,
        flag : false,
        basic : {},
        info : {
            name : '',
            mobile : '',
            idCardNumber : '',
            currentAddress : '',
            degree :'',
            skill : [],
        }
    }

    async updateBasicInfo(){
        Toast.loading('提交中...');
        let {step,basic} = this.state;
        if(step===3 && basic.mobile && basic.idCardNumber && basic.highestDegree){
            let re = await lapi.submitBasicInfo(basic);
            if(re.success){
                this.setState({
                    flag : true
                })
            }else{
                Toast.fail('api error!')
            }
        }

    }
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
    
    nextStep(n,data){
        let {step, basic} = this.state;
        let that = this;
        switch(n){
            case 1:
                step_data[1].activeItem = true;
                this.setState({
                    step : ++step,
                    basic : Object.assign(basic,data)
                })
                break;
            case 2:
                step_data[2].activeItem = true;
                this.setState({
                    step : ++step,
                    basic : Object.assign(basic,data)
                })
                break;
            case 3:
                this.setState({
                    basic : Object.assign(basic,data)
                });
                this.updateBasicInfo();
                break;
        }
    }
    
    render(){
        let {step, flag} = this.state;
        let info = !!this.props.info? this.props.info : this.state.info;
        if(flag){
            return(
                <div className="result-example">
                    <Result style={{ height: '500px'}}
                        img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                        title="操作成功"
                    />
                </div>
            )
        }
        return(
            <div style={{position:'fixed', height:'100%', background:'#fff',width : '100%'}}>
                <Steps style={{ 'marginBottom': '2rem',display:'flex'}} items={step_data}></Steps>
            <div>
                {step===1 && <Step1 info={info} nextStep={::this.nextStep} />}
                {step===2 && <Step2 info={info} nextStep={::this.nextStep} />}
                {step===3 && <Step3 info={info} nextStep={::this.nextStep} />}
            </div>
            </div>
        );
    }
}
