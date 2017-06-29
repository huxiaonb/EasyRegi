import React from 'react';
import ReactDOM from 'react-dom';

import {List, InputItem, Picker, Checkbox, Button} from 'antd-mobile'
import district from 'antd-mobile-demo-data'

import lapi from './registerProfile/lapi'

const CheckboxItem = Checkbox.CheckboxItem;
const openId = $('#openId').text();

class Company extends React.Component{
    state={
        bCheck : true,
        mCheck : true,
        selectCompId: '',
        companies: [{value: 'OOCL', label: 'OOCL'},{value: '金山', label: '金山'}, {value: '西山居', label: '西山居'}],
        currentCompany: []
    }
    async subm(){
        var data = {
            openId: openId,
            companyId: this.state.selectCompId
        }
        let r = await lapi.submitSelectComp(data);
    }
    handleChange(value){
        console.log(value)
        this.setState({
            selectCompId: value
        });
    }
    changeB(e){
        this.setState({
            bCheck: e.target.checked,
        });
    }
    changeM(e){
        this.setState({
            mCheck: e.target.checked,
        });
    }
    onChange = (val) => {
        console.log(val);
    }
    onPickerChange = (val) => {
        console.log(val)
        this.setState({
            currentCompany: val
        })

    }
    render(){ 
        let {bCheck, mCheck} = this.state;
        return(
            <div>
                <div style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >提交入职资料</div>
                <div style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'center'}}>
                        <List renderHeader={()=>'预览'}>
                            <InputItem
                            name="name"
                            placeholder="姓名"
                            defaultValue="付"
                            >姓名</InputItem>
                         
                        <Picker data={this.state.companies} cols={1} className="all-companies" value={this.state.currentCompany} onPickerChange={this.onPickerChange}>
                            <List.Item arrow="horizontal">公司</List.Item>
                        </Picker>    
                        <CheckboxItem key={0} onChange={()=>this.onChange(0)}>个人保证已填写资料属实并同意体检不合格时不予录用</CheckboxItem>
                        <CheckboxItem key={1} onChange={()=>this.onChange(1)}>支付1元支持入职易</CheckboxItem>
                        </List>               
                        <Button type='primary' inline size="small" onClick={this.subm.bind(this)}>提交本人简历</Button>    
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    M & G PRESENTS ©2017  (づ￣ 3￣)づ 
                </div>
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Company args = { args } />, this);})
}