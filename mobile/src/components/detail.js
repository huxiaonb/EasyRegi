import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result, Tag} from 'antd-mobile';
import { Link } from 'react-router';
import lapi from './registerProfile/lapi'
import './less/detail.less'

const Item = List.Item;
const Brief = Item.Brief;
class Detail extends React.Component{
    state={
        data : null
    }
    async componentWillMount(){
        let data = this.props.args;
        if(data.err){
            Toast.error('职位不存在！')
        }else{
            this.setState({data : data})
        }
    }
    render(){
        let {data} = this.state;
        const welfs = (data.welfares.map((w,idx)=>{
            return(
                <Tag selected disabled>{w}</Tag>
            )
        }));
        return(
        <div>
            <List>
                <Item extra={data.companyId}>公司名称</Item>
                <Item extra={data.name}>招聘职位</Item>
                <Item extra={data.totalRecruiters}>招聘人数</Item>
                <Item extra={data.salaryStart + '~' + data.salaryEnd}>薪资待遇</Item>
                <Item>相关福利<Brief>{welfs}</Brief></Item>
                <Item>岗位描述<Brief><p>{data.positionDesc}</p></Brief></Item>
                <Item extra={data.contactPerson}>联系人</Item>
                <Item extra={data.phoneNumber}>联系电话</Item>
            </List>
            <div className='btn-grp'>
                    <a role="button" className="am-button am-button-primary"  href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAwODA1NDM5OQ==&scene=124#wechat_redirect'>关注入职易查看更多职位</a>
                    
            </div>
        </div>)
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Detail args = { args } />, this);})
}