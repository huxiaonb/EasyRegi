import React from 'react'
import { render } from 'react-dom'
//import {Button, Input, DatePicker, Table, Modal, message, Form} from 'antd'

import Form from 'antd/lib/form'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import DatePicker from 'antd/lib/date-picker'
import message from 'antd/lib/message'


import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/input/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/form/style/index.less';
import 'antd/lib/table/style/index.less';
import 'antd/lib/modal/style/index.less';
import 'antd/lib/message/style/index.less';
import 'antd/lib/date-picker/style/index.less';
import './style/components.less';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;

class PositionManage extends React.Component{
    state={
        resultTotal : 0,
        pFlag : false,
        rowValue : {
            positionName : '',
        }
    }
    onSearch(){
        console.log('search');
    }
    clear(){
        console.log('clear');
    }
    toggleP(){
        this.setState({
            pFlag : !this.state.pFlag
        })
    }
    handleOk(){
        //fetch url edit/create
        this.toggleP();
        message.success('操作成功！');
    }
    editP(rec){
        console.log(rec);
        this.setState({
            rowValue : rec
        });
        this.toggleP();
    }
    deleP(rec){
        Modal.confirm({
            title: '确认删除此职位吗？',
            okText: '确认',
            cancelText: '取消',
        });
    }
    componentWillMount(){
        //get table data and set to state,use fetch
    }
    render(){
        let {pFlag} = this.state;
        let {getFieldDecorator} = this.props.form;
        const columns = [{
            title: '名称',
            dataIndex: 'positionName',
            className: 'log-result-noWrap',
        }, {
            title: '创建日期',
            dataIndex: 'submittedAt',
            className: 'log-result-noWrap',
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            className: 'log-result-noWrap',
            render: (text, record) => (
				<span>
					<a style={{marginRight:'5px'}} href="javascript:;" onClick={this.editP.bind(this,record)}>编辑</a><a className='' href="javascript:;" onClick={this.deleP.bind(this,record)}>删除</a>
				</span>
			)
        }, /*{
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
            className: 'log-result-noWrap',
        }*/];
        //mock datasource 
        let list = [
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'}]
        return(
            <div>
            <div className='search-bar-container'>
                <div className='search-title'>
                    招聘职位管理<span title='新增职位' style={{marginLeft:'10px'}}><Button shape="circle" type='primary' icon='plus' onClick={this.toggleP.bind(this)} /></span>
                </div>
                <div className='search-bar-row'>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>职位名</label>
                        <Input className='search-bar-input'/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>创建日期</label>
                        <RangePicker/>
                    </div>
                </div>
                <div className='search-bar-row'>
                    <div className='search-bar-item'>
                        <Button className="search-bar-submit" type="primary" onClick={this.onSearch.bind(this)}>检索</Button> 
                    </div>
                    <div className='search-bar-item'>
                        <a className="search-bar-clear" href="javascript:" onClick={this.clear.bind(this)}>清空条件</a>
                    </div>
                </div>
            </div>
            <div className='search-action-container' style={{textAlign:'left'}}>
                <div className="p-title">
                    <span >{this.state.resultTotal}条检索结果</span>
                </div>
            </div>

            <div style={{margin:'20px 20px 0'}}>
                <Table columns={columns}
                    dataSource={list}
                    pagination={{
                        pageSize: 20,
                        current: 1,
                    }}
                    bordered={true}/>
                </div>
                
                <Modal
                    title="添加新职位"
                    visible={pFlag}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.toggleP.bind(this)}
                    >
                    <Form>
                        <FormItem
                            label='职位名'
                            name='p_name'>
                            {getFieldDecorator('p_name',{
                                rules:[{
                                    type:'string',required:true
                                }],
                                initialValue:this.state.rowValue.positionName
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            label='其他信息'
                            name='p_other'>
                            {getFieldDecorator('p_other',{
                                rules:[{
                                    type:'string',required:true
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                
            </div> 
        )
    }
}
export default Form.create()(PositionManage)