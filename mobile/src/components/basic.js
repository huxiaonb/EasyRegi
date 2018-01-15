import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Step1 from './basicInfo/step1';
import Step2 from './basicInfo/step2';
import Step3 from './basicInfo/step3'

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/basic.less'

const Item = List.Item;
const Brief = Item.Brief;

class Basic extends React.Component{
    state={
        step : 1,
        flag : false,
        basic : {}
    }
    async updateBasicInfo(){
        Toast.loading('....');
        let {step,basic} = this.state;
        if(step===3 && basic.tele && basic.idCardNumber && basic.highestDegree){
            let re = await lapi.submitBasicInfo(basic);
            if(re.success){
                Toast.hide();
                this.setState({
                    flag : true
                })
            }else{
                Toast.err('api error!')
            }
        }

    }
    
    nextStep(n,data){
        let {step, basic} = this.state;
        let that = this;
        switch(n){
            case 1:
                this.setState({
                    step : ++step,
                    basic : Object.assign(basic,data)
                })
                break;
            case 2:
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
            <div>
                <div>欢迎使用入职易</div>
            <div>
                {step===1 && <Step1 nextStep={::this.nextStep} />}
                {step===2 && <Step2 nextStep={::this.nextStep} />}
                {step===3 && <Step3 nextStep={::this.nextStep} />}
            </div>
            </div>
        );
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Basic args = { args } />, this);})
}