import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table} from 'antd'
import PropTypes from 'prop-types';
import moment from 'moment';
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
import api from '../apiCollect'

const {RangePicker } = DatePicker;


export default class ApplicantManage extends React.Component{
    static contextTypes = {
        comp: PropTypes.object
    }
    state={
        resultTotal : 0,
        appiName : '',
        date :[],
        results:[]
    }
    onDateChange(value, dateString) {
        this.setState({
            date:dateString
        })
    }
    onNameChange(e){
        this.setState({
            appiName : e.target.value
        })
    }
    onSearch(){
        console.log('search');
        let {date} = this.state;
        let query = {
            applicantName:this.state.appiName,
            companyId:this.context.comp._id,
            startedAt: date.length>1 ? date[0] :  '',
            endedAt : date.length>1 ? date[1] :  '',
        }
        console.log(query)
        this.searchApplicants(query)
    }
    clear(){
        console.log('clear');
        this.setState({
            appiName:'',
            date:[]
        })
    }
    exportCSV(){
        console.log('export csv');
    }
    preview(record, index, event){
       window.open('../../api/applicant/renderPreviewPage/' + record._id, '_blank');
    }
    async searchApplicants(query={companyId:this.context.comp._id}){
        try{
            let res = await api.searchApplicant(query);
            let data = await res.json();
            this.setState({
                results : data.applicants,
                resultTotal : data.applicants
            })
        }catch(e){
            console.log(e);
        }
    }
    componentWillMount(){
        //get table data and set to state,use fetch
        this.searchApplicants();
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
        /*let list = [
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'},
        {name:'GDGDGDG',gender:'male',birthDate:'2014-12-24',mobile:'1231231312'}]*/
        let list  = this.state.results;
        return(
            <div>

            <div className='search-bar-container'>
                <div className='search-title'>
                    入职员工管理
                </div>
                <div className='search-bar-row'>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>姓名</label>
                        <Input className='search-bar-input' value={this.state.appiName} onChange={this.onNameChange.bind(this)}/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>入职日期</label>
                        <RangePicker format="YYYY-MM-DD"  onChange={this.onDateChange.bind(this)}/>
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