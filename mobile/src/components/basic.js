import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Step1 from './basicInfo/step1';
import Step2 from './basicInfo/step2';
import Step3 from './basicInfo/step3'

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Basic extends React.Component{
    state={
        step : 1,
        basic : {}
    }
    async updateBasicInfo(){
        let {step,basic} = this.state;
        debugger;
        if(step===3 && basic.tele && basic.idCardNumber && basic.highestDegree){
            let re = await lapi.submitBasicInfo(basic);
            if(re.success){
                alert('123');
            }else{
                Toast.err('api error!')
            }
        }

    }
    aaa(){
        console.log('123')
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
        let {step} = this.state;
        return(
            <div>
                {step===1 && <Step1 nextStep={::this.nextStep} />}
                {step===2 && <Step2 nextStep={::this.nextStep} />}
                {step===3 && <Step3 nextStep={::this.nextStep} />}
            </div>
        );
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Basic args = { args } />, this);})
}