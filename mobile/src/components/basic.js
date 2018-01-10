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
        step : 1
    }
    nextStep(){
        //下一步
        let {step} = this.state;
        if(step<3){
            this.setState({
                step : ++step
            })
        }else if(step===3){
            //提交信息 构建对象 call api
            console.log('1111');
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