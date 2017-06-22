import React from 'react';
import ReactDOM from 'react-dom';

import Layout from 'antd/lib/Layout'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Checkbox from 'antd/lib/checkbox'


import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/layout/style/index.less'
import 'antd/lib/button/style/index.less';
import 'antd/lib/select/style/index.less';
import 'antd/lib/checkbox/style/index.less';
import 'antd/lib/form/style/index.less';
import lapi from './registerProfile/lapi'




const { Header, Content, Footer, Sider } = Layout;
const Option = Select.Option;
const openId = $('#openId').text();

class Company extends React.Component{
    state={
        bCheck : true,
        mCheck : true,
        selectCompId: ''
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
    render(){
        let {bCheck, mCheck} = this.state;
        return(
            <Layout>
                <Header style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >公司信息</Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'center'}}>
                        
                        <Select  defaultValue="5936c9311bd50e16e864b918" onChange={this.handleChange.bind(this)} className='ant-form-item' style={{minWidth:'120px'}}>
                            <Option value="5936c9311bd50e16e864b918">OOCL</Option>
                            <Option value="b">公司B</Option>
                            <Option value="c">公司C</Option>
                            <Option value="d">公司D</Option>
                        </Select>
                        <Checkbox onChange={this.changeB.bind(this)} checked={bCheck} className='ant-form-item' style={{display:'block'}}>个人保证已填写资料属实并同意体检不合格时不予录用</Checkbox>
                        <Checkbox onChange={this.changeM.bind(this)} checked={mCheck} className='ant-form-item' style={{display:'block'}}>支付1元支持入职易</Checkbox>                    
                        <Button type='primary' disabled={!(bCheck && mCheck)} onClick={this.subm.bind(this)}>提交本人简历</Button>    
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    M & G PRESENTS ©2017  (づ￣ 3￣)づ 
                </Footer>
            </Layout>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Company args = { args } />, this);})
}