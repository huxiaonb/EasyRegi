import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/detail.less'

const Item = List.Item;
const Brief = Item.Brief;
class Detail extends React.Component{
    state={
        data : {}
    }
    async componentWillMount(){
        let r = lapi.loadPositionDetail(id);
        if(r.success){
            this.setState({
                data : r.data
            })
        }
    }
    render(){
        return(
        <div>
            <List>
                <Item extra={'extra content'}>公司名称</Item>
                <Item extra={'extra content'}>招聘职位</Item>
                <Item extra={'extra content'}>招聘人数</Item>
                <Item extra={'extra content'}>薪资待遇</Item>
                <Item>相关福利<Brief><p>123</p><p>123</p><p>123</p></Brief></Item>
                <Item>岗位描述<Brief><p>123</p></Brief></Item>
                <Item extra={'extra content'}>联系人</Item>
                <Item extra={'extra content'}>联系电话</Item>
            </List>
            <div className='btn-grp'>
                <Button type='primary'>关注入职易查看更多职位</Button>
                <Button className='grp-mg'  type='primary'>立即转发职位抢红包</Button>
            </div>
        </div>)
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Detail args = { args } />, this);})
}