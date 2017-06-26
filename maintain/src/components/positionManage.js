import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table} from 'antd'
import './index.less';
const {RangePicker } = DatePicker;

export default class PositionManage extends React.Component{
    state={
        resultTotal : 0,
    }
    onSearch(){
        console.log('search');
    }
    clear(){
        console.log('clear');
    }
    
    
    componentWillMount(){
        //get table data and set to state,use fetch
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'positionName',
            className: 'log-result-noWrap',
        }, {
            title: '创建日期',
            dataIndex: 'submittedAt',
            className: 'log-result-noWrap',
        },/*{
            title: '出生日期',
            dataIndex: 'birthDate',
            key: 'birthDate',
            className: 'log-result-noWrap',
        }, {
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
                    招聘职位管理
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
            </div>
            
        )
    }
}