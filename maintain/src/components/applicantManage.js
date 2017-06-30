import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table} from 'antd'
// import Table from 'antd/lib/table'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import DatePicker from 'antd/lib/date-picker'

// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/table/style/index.less';
// import 'antd/lib/date-picker/style/index.less';
import './style/components.less';

const {RangePicker } = DatePicker;

export default class ApplicantManage extends React.Component{
    state={
        resultTotal : 0,
    }
    onSearch(){
        console.log('search');
    }
    clear(){
        console.log('clear');
    }
    exportCSV(){
        console.log('export csv');
    }
    preview(record, index, event){
        //record is table row record
        console.log('123');
        //some logic then open a new tab in browser
        let win = window.open('http://www.baidu.com', '_blank');
    }
    componentWillMount(){
        //get table data and set to state,use fetch
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            className: 'log-result-noWrap',
        }, {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            className: 'log-result-noWrap',
        },{
            title: '出生日期',
            dataIndex: 'birthDate',
            key: 'birthDate',
            className: 'log-result-noWrap',
        }, {
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
            className: 'log-result-noWrap',
        }];
        //mock datasource 
        let list = [
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'}]
        return(
            <div>

            <div className='search-bar-container'>
                <div className='search-title'>
                    入职员工管理
                </div>
                <div className='search-bar-row'>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>姓名</label>
                        <Input className='search-bar-input'/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>入职日期</label>
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
            <div className='search-action-container'>
                <div className="title">
                    <span >{this.state.resultTotal}条检索结果</span>
                </div>
                <div className="btns">
                    <Button icon="upload" disabled={this.state.resultTotal === 0} onClick={this.exportCSV.bind(this)}>导出结果(csv)</Button>
                </div>
            </div>

            <div style={{margin:'20px 20px 0'}}>
                <Table columns={columns}
                    dataSource={list}
                    pagination={{
                        pageSize: 20,
                        current: 1,
                    }}
                    onRowClick={this.preview.bind(this)}
                    bordered={true}/>
                </div>


            </div>
        )
    }
}