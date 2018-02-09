import React from 'react'
import { render } from 'react-dom'
import { Button, Input, DatePicker, Table, Modal, message, Form, Select, InputNumber, Col, Slider, Radio} from 'antd'
import moment from 'moment';
import PropTypes from 'prop-types';
import api from '../apiCollect'
import './style/position.less'
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
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const MAX_SALARY=10000;
const MAX_HOUR_SALARY=40
const MAX_AGE = 60;
const welfs = ['准时发薪','年底双薪', '包吃', '包住', '包吃包住', '购买社保', '五险一金', '带薪休假', '年度体检', '年度旅游', '坐着工作', '周末双休', '宿舍24小时热水', '空调工作环境', '宿舍有空调', '妹子多', '伙食好', '伙食津贴', '免穿防静电服', '提供交通补助', '夜班津贴', '年资津贴']
const ages = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60]
const salary = [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 100000];
const hour_salary = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
class PositionManage extends React.Component{
    static contextTypes = {
        comp: PropTypes.object
    }
    state={
        loading : false,
        posiName : '',
        date : [],
        results : [],
        resultTotal : 0,
        pFlag : false,
        rowValue : {},
        ageStart : undefined,
        lowSalary : undefined,
        newFlag :false,
        salaryRadio : 'month'
    }
    dateStartChange(d){
        this.setState({
            startDate : d
        })
    }
    dateEndChange(d){
        this.setState({
            endDate: d
        })
    }
    disabledDate(d){
        let { startDate} = this.state;
        return d < startDate.valueOf();
    }
    changePacketType(val){
        this.setState({
            red_type : val
        })
    }
    ageStartChange(val){
        debugger;
        this.setState({
            ageStart : val
        })
    }
    onLowSalaryChange(val){
        this.setState({
            lowSalary : val
        })
    }
    onSalaryRadioChange(val){
        this.setState({
            salaryRadio : val
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
        if(this.state.pFlag){
            this.props.form.resetFields();
        }
        this.setState({
            pFlag : false,
            loading : false
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
             this.setState({
                loading : true,
            });
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
             if(!this.state.newFlag){
                 try{
                    newP._id = this.state.rowValue._id;
                    
                    let res = await api.updatePosition({companyId : this.context.comp._id,position:newP});
                    let data = await res.json();
                    message.success('操作成功！');
                }catch(e){
                    message.error('出错请联系管理员');
                    console.log(e);
                }
             }else{
                 try{
                    let res = await api.createPosition({companyId : this.context.comp._id,position:newP});
                    let data = await res.json();
                    message.success('操作成功！');
                }catch(e){
                    message.error('出错请联系管理员');
                    console.log(e);
                }
             }
                this.searchPosi();
                this.setState({
                    loading : false,
                    pFlag : false
                })  
            });
                
    }
    createForm(){
        let {form} = this.props;
        form.setFieldsValue({
                'p_name' : '',
                'p_contact' :'',
                'p_phone' : '',
                'p_total' : '',
                'p_salary' : [],
                'p_welfare' : [],
                'p_desc' : '',
                'p_require' : ''
            });
            this.setState({newFlag : true, pFlag :true});
            
    }
    editP(rec){
        let {form} = this.props;
        if(rec.ageRangeStart && rec.salaryStart){
            this.setState({
                rowValue : rec,
                newFlag : false,
                ageRange:[rec.ageRangeStart,rec.ageRangeEnd],
                salaryRange:[rec.salaryStart,rec.salaryEnd],
                pFlag : true
            });
        }else{
            this.setState({
                rowValue : rec,
                newFlag : false,
                ageRange:[20,50],
                salaryRange:[3000,6000],
                pFlag : true
            });
        }
        form.setFieldsValue({
                'p_name' : rec.name,
                'p_contact' : rec.contactPerson,
                'p_phone' : rec.phoneNumber,
                'p_total' : rec.totalRecruiters,
                'p_welfare' : rec.welfares,
                'p_desc' : rec.positionDesc,
                'p_require' : rec.jobRequire
            });
        
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
        let { pFlag, ageStart, lowSalary, salaryRadio} = this.state;
        let {getFieldDecorator} = this.props.form;
        let  ageEnd, highSalary = []
        
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
        let {createF, loading} = this.state
        
        return(
            <div>
            <div className='search-bar-container'>
                <div className='search-title'>
                        招聘职位管理<span title='新增职位' style={{ marginLeft: '10px' }}><Button type='primary' onClick={this.createForm.bind(this)}>新增招聘职位</Button></span>
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
                    }}
                    bordered={true}
                    scroll={{x:1300}}
                />
                </div>
                
                <Modal
                    title={<p style={{ fontSize: 20, color:'#555'}}>添加新职位</p>}
                    visible={pFlag}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.toggleP.bind(this)}
                    confirmLoading={loading}
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
                        
                        <FormItem label='年龄' labelCol={{ span: 5 }}>
                            <Col span={7} offset={1}>
                            <FormItem>
                                    <Select defaultValue="16" onChange={this.ageStartChange.bind(this)} >
                                        {ages.map(a=>(<Option value={a}>{a}</Option>))}
                                    </Select>
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                            </span>
                        </Col>
                        <Col span={7} >
                            <FormItem>
                                    <Select defaultValue="45"  >
                                        {ages.map(a=>(a>ageStart ? <Option value={a}>{a}</Option> : null))}
                                    </Select>
                            </FormItem>
                        </Col>
                        </FormItem>
                        <FormItem label='有效期' labelCol={{ span: 5 }}>
                            <Col span={7} offset={1}>
                                <FormItem>
                                    <DatePicker 
                                    placeholder='YYYY-MM-DD'
                                    format="YYYY-MM-DD"
                                    onChange={this.dateStartChange.bind(this)}/>
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                    -
                            </span>
                            </Col>
                            <Col span={7} >
                                <FormItem>
                                    <DatePicker 
                                        placeholder='YYYY-MM-DD'
                                        format="YYYY-MM-DD"
                                        onChange={this.dateEndChange.bind(this)}
                                        disabledDate={this.disabledDate.bind(this)}
                                    />
                                </FormItem>
                            </Col>
                        </FormItem>

                            
                        <Col id='psalary' offset={1}>
                            <RadioGroup className='ant-col-offset-5' style={{ marginBottom: 15 }} defaultValue="month" onChange={this.onSalaryRadioChange.bind(this)}>
                                <RadioButton value="month">月薪</RadioButton>
                                <RadioButton value="hour">时薪</RadioButton>
                            </RadioGroup>
                            <FormItem label='薪资' labelCol={{ span: 4 }}>
                                <Col span={7} offset={1}>
                                    <FormItem>
                                        <Select defaultValue="1000"  onChnage={this.onLowSalaryChange.bind(this)}>
                                            {salaryRadio === 'hour' ? hour_salary.map(h => (<Option value={h}>{h}</Option>)) : salary.map(s => (<Option value={s}>{s}</Option>))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                            </span>
                                </Col>
                                <Col span={7} >
                                    <FormItem >
                                        <Select defaultValue="5000"  >
                                            {salaryRadio === 'hour' ? hour_salary.map(h => (h>lowSalary ? (<Option value={h}>{h}</Option>):null)) : salary.map(s => (s>lowSalary? (<Option value={s}>{s}</Option>): null))}
                                        </Select>
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                        
                        <Col offset={1} id='pred'>
                            <RadioGroup className='ant-col-offset-5' style={{ marginBottom: 15 }} defaultValue="normal" onChange={this.changePacketType.bind(this)}>
                                <RadioButton value="normal">普通红包</RadioButton>
                                <RadioButton value="rand">随机红包</RadioButton>
                            </RadioGroup>
                            <FormItem label='hb' labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18, offset: 1 }}>
                                <Col span={7}>
                                    <FormItem name='red_sum'>
                                        <Input placeholder='总金额' />
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                            </span>
                                </Col>
                                <Col span={7} >
                                    <FormItem name='red_total'>
                                        <InputNumber placeholder='红包个数' max={1000} min={1} default={10}/>
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                        <div style={{marginTop : '-25px', marginBottom : 15}}>
                            附赠转发红包可让本职位在微信上快速传播
                        </div>
                       
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
                                    {welfs.map(w=>(<Option value={w}>{w}</Option>))}                                    
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