import React from 'react'
import QRCode from 'qrcode.react';
import { render } from 'react-dom';
import api from '../apiCollect';
import { Modal, Button, Input, InputNumber, DatePicker, Table, Select} from 'antd'

const Option = Select.Option;
export default class Resume extends React.Component {
    state={
        money : ''
    }
    async goToCharge(){
        let r = await weCharege(this.state.money);
        let res = await r.json();
        if (res.success) {
            Modal.info({
                title: '扫码支付',
                content: (
                    <div style={{ marginTop: 30, marginLeft: 55 }}>
                        <QRCode
                            value={res.code_url}
                            size={128}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                        />
                    </div>
                ),
                onOk() {
                    alert('123');
                },
            });
        }
        
    }
    componentWillMount(){
        //get company 余额
    }
    render(){
        return(
            <div>
            <div className='charge-container'>
                <div style={{display:'flex'}}><div className='charge-title'></div><h1>充值</h1></div>
                <div className='charge-item ant-row ant-form-item'>
                    <span className='ant-form-item-label'>账户余额：</span>
                    <span>123</span>
                </div>
                <div className='charge-item ant-row ant-form-item'>
                    <span className='ant-form-item-label'>充值金额：</span>
                    <Select size='large' style={{width:120}} onChange={(v)=>{this.setState({money : v})}}>
                            <Option value='1'>1</Option>
                        <Option value='10'>10</Option>
                        <Option value='20'>20</Option>
                        <Option value='50'>50</Option>
                        <Option value='100'>100</Option>
                        <Option value='200'>200</Option>
                        <Option value='500'>500</Option>
                        <Option value='1000'>1000</Option>
                    </Select>
                </div>
                <Button type='primary' size='large' style={{marginTop:20, width:180, height:40}} onClick={this.goToCharge.bind(this)}>去充值</Button>
            </div>
            
            </div>
        )
    }
}