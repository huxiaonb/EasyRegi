import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Table, Modal, message, Form, Select, InputNumber, Slider} from 'antd'
import PropTypes from 'prop-types';
import api from '../apiCollect'

// import Form from 'antd/lib/form'
// import Table from 'antd/lib/table'
// import Modal from 'antd/lib/modal'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import DatePicker from 'antd/lib/date-picker'
// import message from 'antd/lib/message'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';
// import 'antd/lib/table/style/index.less';
// import 'antd/lib/modal/style/index.less';
// import 'antd/lib/message/style/index.less';
// import 'antd/lib/date-picker/style/index.less';
import './style/components.less';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const salaryMarks = {
  1000: '1000 CNY',
  30000 : {
    style: {
      color: '#f50',
    },
    label: <strong>30000CNY</strong>,
  },
};
const ageMarks = {
  16 : '16',
  60 : '60'
};
class PositionManage extends React.Component{
    static contextTypes = {
        comp: PropTypes.object
    }
    state={
        posiName : '',
        date : [],
        results : [],
        resultTotal : 0,
        pFlag : false,
        rowValue : {},
        ageRange : [20,50],
        salaryRange : [3000,6000]
        
    }
    onAgeSliderChange(value){
        this.setState({
            ageRange : value
        })
    }
    onSalarySliderChange(value){
        this.setState({
            salaryRange : value
        })
    }
    posiNameChange(e){
        this.setState({
            posiName : e.target.value
        })
    }
    dateChange(value, dateString){
        this.setState({
            date : dateString
        })
    }
    onSearch(){
        let {posiName,date} = this.state;
        let query = {
            companyId : this.context.comp._id,
            positionName : posiName,
            startAt : date.length ? date[0]:'',
            endAt : date.length ? date[1]:''
        }
        this.searchPosi(query);
        console.log('search');
        
    }
    
    clear(){
        this.setState({
            posiName : ''
        })
        console.log('clear');
    }
    
    toggleP(){
        this.setState({
            pFlag : !this.state.pFlag
        });
    }
    async handleOk(){
        //fetch url edit/create
        let {form} = this.props;
        let {salaryRange, ageRange} = this.state;
        form.validateFieldsAndScroll(async (err, values)=>{
             if (!!err){
                return;
             }
             let newP = Object.assign({},{
                 name : form.getFieldValue('p_name'),
                 contactPerson : form.getFieldValue('p_contact'),
                 phoneNumber : form.getFieldValue('p_phone'),
                 totalRecruiters : form.getFieldValue('p_total'),
                 salary : form.getFieldValue('p_salary'),
                 welfares : form.getFieldValue('p_welfare'),
                 positionDesc : form.getFieldValue('p_desc'),
                 jobRequire : form.getFieldValue('p_require'),
                 salaryStart : salaryRange[0],
                 salaryEnd : salaryRange[1],
                 ageRangeStart : ageRange[0],
                 ageRangeEnd : ageRange[1],
             });
             if(this.state.rowValue.name){
                 try{
                    newP._id = this.state.rowValue._id;
                    
                    let res = await api.updatePosition({companyId : this.context.comp._id,position:newP});
                    let data = await res.json();
                    this.toggleP();
                    message.success('操作成功！');
                    this.searchPosi();
                }catch(e){
                    message.error('出错请联系管理员');
                    console.log(e);
                }
             }else{
                 try{
                    let res = await api.createPosition({companyId : this.context.comp._id,position:newP});
                    let data = await res.json();
                    this.toggleP();
                    message.success('操作成功！');
                    this.searchPosi();
                }catch(e){
                    message.error('出错请联系管理员');
                    console.log(e);
                }
             }
            })         
    }
    createForm(){
        let {form} = this.props;
        form.setFieldsValue({
                'p_name' : '',
                'p_phone' : '',
                'p_total' : '',
                'p_salary' : '',
                'p_welfare' : [],
                'p_desc' : '',
                'p_require' : ''
            });
            this.toggleP();
    }
    editP(rec){
        let {form} = this.props;
        this.setState({
            rowValue : rec,
        });
        form.setFieldsValue({
                'p_name' : rec.name,
                'p_phone' : rec.phoneNumber,
                'p_total' : rec.totalRecruiters,
                'p_salary' : rec.salary,
                'p_welfare' : rec.welfares,
                'p_desc' : rec.positionDesc,
                'p_require' : rec.jobRequire
            });
        this.toggleP();
    }
    deleP(rec){
        let that = this;
        Modal.confirm({
            title: '确认删除此职位吗？',
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                try{
                    let res = await api.delPosition({companyId:that.context.comp._id, positionId:rec._id});
                    let data = await res.json();
                    message.success('已删除');
                    that.searchPosi();
                }catch(e){
                    message.error('出错请联系管理员');
                    console.log(e)
                }
            } 
        });
    }
    async searchPosi(query={companyId : this.context.comp._id}){
        let res = await api.searchPostion(query);
        let data = await res.json();
        
        
        this.setState({
            results : data.positions,
            resultTotal : data.positions.length,
            
        })
        console.log(data);
    }
    async componentWillMount(){
        //get table data and set to state,use fetch
       await this.searchPosi(); 
    }
    render(){
        let {pFlag} = this.state;
        let {getFieldDecorator} = this.props.form;
        const columns = [{
            title: '名称',
            dataIndex: 'name',
            key : 'name',
            className: 'log-result-noWrap',
        },{
            title: '联系人',
            dataIndex: 'contactPerson',
            key : 'contactPerson',
            className: 'log-result-noWrap',
        },{
            title: '联系电话',
            dataIndex: 'phoneNumber',
            key : 'phoneNumber',
            className: 'log-result-noWrap',
        },{
            title: '招聘人数',
            dataIndex: 'totalRecruiters',
            key : 'totalRecruiters',
            className: 'log-result-noWrap',
        },{
            title: '年龄',
            key : 'age',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{record.ageRangeStart}~{record.ageRangeEnd}</span>)
        },{
            title: '薪资',
            key : 'salary',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{record.salaryStart}~{record.salaryEnd}</span>)
        },{
            title: '福利',
            dataIndex: 'welfares',
            key : 'welfares',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{text.join(',')}</span>)
        },{
            title: '职位要求',
            dataIndex: 'jobRequire',
            key : 'jobRequire',
            className: 'log-result-noWrap',
        },{
            title: '职位描述',
            dataIndex: 'positionDesc',
            key : 'positionDesc',
            className: 'log-result-noWrap',
        }
        ,{
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
        /*let list = [
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'},
        {positionName:'GDGDGDG',gender:'male',submittedAt:'2014-12-24',mobile:'1231231312'}]*/
        //let list = [{name:'123',phoneNumber:'123',totalRecuriters:'123',salary:'123',welfares:'123',jobRequire:'123',positionDesc:'1231'}]
        let list = this.state.results;
        let {createF} = this.state
        return(
            <div>
            <div className='search-bar-container'>
                <div className='search-title'>
                    招聘职位管理<span title='新增职位' style={{marginLeft:'10px'}}><Button shape="circle" type='primary' icon='plus' onClick={this.createForm.bind(this)} /></span>
                </div>
                <div className='search-bar-row'>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>职位名</label>
                        <Input className='search-bar-input' value={this.state.posiName} onChange={this.posiNameChange.bind(this)}/>
                    </div>
                    <div className='search-bar-item'>
                        <label className='search-bar-label'>创建日期</label>
                        <RangePicker onChange={this.dateChange.bind(this)} format='YYYY-MM-DD'/>
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
                    bordered={true}
                    scroll={{x:1300}}
                />
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
                            name='p_name'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_name',{
                                rules:[{
                                    type:'string',required:true,maxLength:15,message:'请输入有效的职位名！'
                                }]
                                
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            label='联系人'
                            name='p_contact'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_contact',{
                                rules:[{
                                    type:'string',required:true,maxLength:15,message:'请输入有效的联系人！'
                                }]
                                
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            label='联系电话'
                            name='p_phone'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_phone',{
                                rules:[{
                                    type:'string',required:true, message:'请输入有效的联系电话！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='招聘人数'
                            name='p_total'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_total',{
                                rules:[{
                                    type:'string',required:true,maxLength:3, message:'请输入有效的招聘人数！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='年龄'
                            name='p_salary'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <Slider range={true} marks={ageMarks} min={16} max={60} step={1} defaultValue={this.state.ageRange} onChange={this.onAgeSliderChange.bind(this)} />
                        </FormItem>
                        <FormItem
                            label='薪资'
                            name='p_salary'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <Slider range={true} marks={salaryMarks} min={1000} max={30000} step={1000} defaultValue={this.state.salaryRange} onChange={this.onSalarySliderChange.bind(this)} />
                        </FormItem>
                        
                       
                         <FormItem
                            label='福利'
                            name='p_welfare'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_welfare',{
                                rules:[{
                                    type:'array',required:true, message:'请选择有效的福利！'
                                }]
                            })(
                                <Select mode='multiple' placeholder='请选择...'>
                                    <Option value='五险一金'>五险一金</Option>
                                    <Option value='带薪年假'>带薪年假</Option>
                                    <Option value='年度旅游'>年度旅游</Option>
                                    <Option value='商业保险'>商业保险</Option>                                    
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label='职位要求'
                            name='p_require'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_require',{
                                rules:[{
                                    type:'string',required:true, message:'请输入有效的职位要求！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label='职位描述'
                            name='p_desc'
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('p_desc',{
                                rules:[{
                                    type:'string',required:true, message:'请输入有效的职位描述！'
                                }]
                            })(
                                <Input type='textarea' style={{resize:"none"}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                
            </div> 
        )
    }
}
export default Form.create()(PositionManage)