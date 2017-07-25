import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Positions extends React.Component{
    state = {
        geolocation : null
    }
    componentWillMount(){
        let info = this.props.args;
        
        this.setState({
            geolocation : info,
        });
        //get position List
    }
    render(){
        let {geolocation} = this.state;
        let location = JSON.stringify(geolocation)
        let addr =  geolocation.nation + ',' + geolocation.province + ',' + geolocation.city + ',' +  geolocation.district + ',' + geolocation.addr;
        return(
            <div className='ant-layout'>
                <div className='ant-layout-header' style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >附近的职位</div>
                <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'left'}}>
                        <Accordion accordion>
                            <Accordion.Panel header="地址" className="">地址：{addr}</Accordion.Panel>
                        </Accordion>
                        <Accordion>
                            <Accordion.Panel header="对象" className="">api返回对象：{location}</Accordion.Panel>
                        </Accordion>
                        <Accordion>
                            <Accordion.Panel header="职位1" className="">职位1</Accordion.Panel>
                        </Accordion>
                        <Accordion>
                            <Accordion.Panel header="职位2" className="">职位2</Accordion.Panel>
                        </Accordion>
                        <Accordion>
                            <Accordion.Panel header="职位3" className="">职位3</Accordion.Panel>
                        </Accordion>
                        <Accordion>
                            <Accordion.Panel header="职位5" className="">职位5</Accordion.Panel>
                        </Accordion>
                    </div>
                </div>
                <div className='ant-layout-footer' style={{ textAlign: 'center' }}>
                    M & G PRESENTS ©2017  (づ￣ 3￣)づ 
                </div>
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Positions args = { args } />, this);})
}