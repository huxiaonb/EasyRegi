import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table, message} from 'antd'
import PropTypes from 'prop-types';
import moment from 'moment';

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
        let {date} = this.state;
        let query = {
            applicantName:this.state.appiName,
            companyId:this.context.comp._id,
            startedAt: date.length>1 ? date[0] :  '',
            endedAt : date.length>1 ? date[1] :  '',
        }
        console.log(query)
        this.searchResumes(query)
    }
    clear(){
        console.log('clear');
        this.setState({
            appiName:'',
            date:[]
        });
        this.searchResumes();
    }
    
    preview(record, index, event){
        let companyName = this.context.comp.companyName;
        window.open('../../applicant/preview?id=' + record._id + '&companyName=' + companyName, '_blank');
    }
    async invite(rec, e){
        e.stopPropagation();
        let {results} = this.state;
        let companyName = this.context.comp.companyName;
        let applicantName = rec.name;
        let r = await api.sendResumeHasBeenCheckedMessage({companyName:companyName, applicantName : applicantName});
        let res = await r.json();
        if(res.success){
            this.setState({
                results : results.filter(r=>r._id !== rec._id)
            })
            message.success('已发送面试邀请！');
        }
    }
    async searchResumes(query={}){
        try{
            let res = await api.searchResumes(query);
            let data = await res.json();
            this.setState({
                results : data.applicants,
                resultTotal : data.applicants.length
            })
        }catch(e){
            console.log(e);
        }
    }
    componentWillMount(){
        //get table data and set to state,use fetch
        this.searchResumes();
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
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            className: 'log-result-noWrap',
            render: (text, record) => (
				<span>
					<a className='' href="javascript:;" onClick={this.invite.bind(this,record)}>邀请入职</a>
				</span>
			)
        },];
        
        let list  = this.state.results;
        return(
            <div>

            <div className='search-bar-container'>
                <div className='search-title'>
                    简历池
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
                <div style={{textAlign:'left'}}>
                    <span >{this.state.resultTotal}条检索结果</span>&nbsp;<span>(双击可预览及打印员工个人简历)</span>
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
                    bordered={true}
                    scroll={{x:1300}}
                    />
                </div>


            </div>
        )
    }
}