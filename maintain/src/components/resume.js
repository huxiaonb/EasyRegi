import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table, message, Select, InputNumber} from 'antd'
import PropTypes from 'prop-types';
import moment from 'moment';

import api from '../apiCollect'

const {RangePicker } = DatePicker;
const {Option} = Select;


export default class ApplicantManage extends React.Component{
    static contextTypes = {
        comp: PropTypes.object
    }
    state={
        resultTotal : 0,
        appiName : '',
        date :[],
        district: '',
        gender: '',
        ageRangeStart: '',
        ageRangeEnd: '',
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
    onDistrictChange(e) {
        this.setState({
            district: e.target.value
        });
    }
    onGenderChange(value) {
        this.setState({
            gender: value
        });
    }
    onAgeStartChange(value) {
        if(value === undefined || value === null || isNaN(parseInt(value))) {
            this.setState({
                ageRangeStart: ''
            });
        } else {
            this.setState({
                ageRangeStart: value.toString()
            });
        }
    }
    onAgeEndChange(value) {
        if(value === undefined || value === null || isNaN(parseInt(value))) {
            this.setState({
                ageRangeEnd: ''
            });
        } else {
            this.setState({
                ageRangeEnd: value.toString()
            });
        }
    }
    onSearch(){
        let {date, district, gender, ageRangeStart, ageRangeEnd} = this.state;
        let query = {
            applicantName:this.state.appiName,
            startedAt: date.length>1 ? date[0] :  '',
            endedAt : date.length>1 ? date[1] :  '',
            district: district,
            gender: gender,
            ageRangeStart: ageRangeStart,
            ageRangeEnd: ageRangeEnd
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
    async toCopmleteDetail(rec, e){
        //需控制频率
        e.target.setAttribute('disabled','disabled');
        e.stopPropagation();
        let {results} = this.state;
        let companyName = this.context.comp.companyName;
        let companyId = this.props.companyInfo._id;
        let applicantName = rec.name;
        let openId = rec.wechatOpenId;
        let r = await api.sendResumeHasBeenCheckedMessage({companyId: companyId, companyName:companyName, applicantName : applicantName, openId : openId});
        let res = await r.json();
        if(res.success){
            message.success('已发送补充简历通知！');
        }
    }
    async invite(rec, e){
        //需控制频率
        e.target.setAttribute('disabled','disabled');
        e.stopPropagation();
        let {results} = this.state;
        let companyName = this.props.companyInfo.companyName;
        let applicantName = rec.name;
        let openId = rec.wechatOpenId;
        let r = await api.sendInterviewMessage({companyName:companyName, applicantName : applicantName, openId : openId});
        let res = await r.json();
        if(res.success){
            message.success('已发送面试邀请！');
        }
    }
    async searchResumes(query={}){
        try{
            query.companyId = this.context.comp._id;
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
            render: text => (<span>{text.slice(0, 10)}</span>)
        }, {
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
            className: 'log-result-noWrap',
        },{
            title: '详细简历',
            dataIndex: 'isComplete',
            key: 'isComplete',
            className: 'log-result-noWrap',
            render: (text, record) => (
                <span>{text ? '有' : '无'}</span>
            )
        },{
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            className: 'log-result-noWrap',
            render: (text, record) => (
				<span>
                    {!record.isComplete && !record.completeResumeInvitationList.includes(this.props.companyInfo._id) && <a className=''  href="javascript:;" onClick={this.toCopmleteDetail.bind(this,record)}>完善简历</a>}{!record.isComplete && record.completeResumeInvitationList.includes(this.props.companyInfo._id) && <span>已邀请完善简历</span>}{!!record.isComplete && !record.interviewInvitationList.includes(this.props.companyInfo._id) && <a className='' href="javascript:;" onClick={this.invite.bind(this,record)}>邀请入职</a>}{!!record.isComplete && record.interviewInvitationList.includes(this.props.companyInfo._id) && <span>已发出入职邀请</span>}
				</span>
			)
        }];
        
        let list  = this.state.results;
        return(
            <div>

            <div className='search-bar-container'>
                <div className='search-title'>
                    简历浏览
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
                        <label className='search-bar-label'>地区</label>
                        <Input className='search-bar-input' onChange={this.onDistrictChange.bind(this)}/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>年龄范围</label>
                        <InputNumber className='search-bar-input' min={1} max={100} step={1} style={{ width: 120 }} onChange={this.onAgeStartChange.bind(this)}/>-
                        <InputNumber className='search-bar-input' min={1} max={100} step={1} style={{ width: 120 }} onChange={this.onAgeEndChange.bind(this)}/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>性别</label>
                        <Select className='search-bar-input' defaultValue="" style={{ width: 120 }} onChange={this.onGenderChange.bind(this)}>
                            <Option value="" disabled>无</Option>
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                        </Select>
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
                    <span >{this.state.resultTotal}条检索结果</span>&nbsp;<span>(单击某行可预览及打印员工个人简历)</span>
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