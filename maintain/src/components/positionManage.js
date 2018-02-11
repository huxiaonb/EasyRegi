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
        salary_type : 'month',
        red_type : 'normal'
    }
    changePacket(val){
        this.setState({
            luckyFlag : val
        })
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
            red_type :  val.target.value
        })
    }
    ageStartChange(val){
        this.setState({
            ageStart : val
        })
    }
    onLowSalaryChange(val){
        this.setState({
            lowSalary : val
        })
    }
    onsalary_typeChange(val){
        let { form } = this.props;
        val.target.value==='hour'? form.setFieldsValue({
            'salary_start': 20,
            'salary_end': 28
        }) : form.setFieldsValue({
            'salary_start': 1000,
            'salary_end': 5000
        });
        this.setState({
            salary_type : val.target.value
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
        if(parseInt(form.getFieldValue('red_sum'))/parseInt(form.getFieldValue('red_count'))<1 || parseInt(form.getFieldValue('red_sum'))/parseInt(form.getFieldValue('red_count'))>200){
            Toast.warning('红包设置不合理,请检查后重试');
            return;
        }  
        
        let {salary_type, red_type} = this.state;
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
                 welfares : form.getFieldValue('p_welfare'),
                 positionDesc : form.getFieldValue('p_desc'),
                 jobRequire : form.getFieldValue('p_require'),
                 salaryStart : form.getFieldValue('salary_start'),
                 salaryEnd : form.getFieldValue('salary_end'),
                 ageRangeStart : form.getFieldValue('age_start'),
                 ageRangeEnd : form.getFieldValue('age_end'),
                 luckyFlag : form.getFieldValue('luckyflag'),
                 redPackSum : form.getFieldValue('red_sum'),
                 redPackCount : form.getFieldValue('red_count'),
                 redPackType : red_type,
                 salaryType : salary_type,
                 beginDate : form.getFieldValue('date_start'),
                 endDate : form.getFieldValue('date_end'),
             });
             if(!this.state.newFlag){
                 try{
                    newP._id = this.state.pid;
                    
                    let res = await api.updatePosition({companyId : this.context.comp._id, position:newP});
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
        form.resetFields();
        this.setState({newFlag : true, pFlag :true});
            
    }
    editP(rec){
        let {form} = this.props;
        form.resetFields();
        form.setFieldsValue({
                'p_name' : rec.name,
                'p_contact' : rec.contactPerson,
                'p_phone' : rec.phoneNumber,
                'p_total' : rec.totalRecruiters,
                'p_welfare' : rec.welfares,
                'p_desc' : rec.positionDesc,
                'p_require' : rec.jobRequire,
                'salary_start' : rec.salaryStart,
                'salary_end' : rec.salaryEnd,
                'age_start' : rec.ageRangeStart,
                'age_end' : rec.ageRangeEnd,
                'luckyflag' : rec.luckyFlag,
                'red_sum' : rec.redPackSum,
                'red_count':rec.redPackCount,
                'date_start' : moment(rec.beginDate),
                'date_end' : moment(rec.endDate)
            });
            this.setState({newFlag:false,pFlag : true, pid : rec._id})
        
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
        let { pFlag, ageStart, lowSalary, salary_type} = this.state;
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
            title: '职位红包',
            dataIndex: 'luckyFlag',
            key : 'luckyFlag',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{record.luckyFlag === '1'? (record.redPackType==='normal'? '普通红包：' + record.redPackSum + '元/' + record.redPackCount + '个' : '随机红包：' + record.redPackSum + '元/' + record.redPackCount + '个') : '无'}</span>)
        },{
            title: '年龄',
            key : 'age',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{record.ageRangeStart}~{record.ageRangeEnd}</span>)
        },{
            title: '薪资',
            key : 'salary',
            className: 'log-result-noWrap',
            render:(text,record)=>(<span>{record.salaryType==='hour'? '时薪:' : '月薪:'}{record.salaryStart}~{record.salaryEnd}</span>)
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
                            <FormItem name='age_start'>
                            {getFieldDecorator('age_start',{initialValue : 16})(
                                    <Select onChange={this.ageStartChange.bind(this)} >
                                        {ages.map(a=>(<Option key={a.toString()} value={a}>{a}</Option>))}
                                    </Select>
                            )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                -
                            </span>
                        </Col>
                        <Col span={7} >
                            <FormItem name='age_end'>
                                {getFieldDecorator('age_end',{initialValue : 45})(
                                    <Select>
                                        {ages.map(a=>(a>ageStart && <Option key={a.toString()} value={a}>{a}</Option>))}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        </FormItem>
                        <FormItem label='有效期' labelCol={{ span: 5 }}>
                            <Col span={7} offset={1}>
                                <FormItem>
                                    {getFieldDecorator('date_start')(
                                        <DatePicker 
                                            placeholder='YYYY-MM-DD'
                                            format="YYYY-MM-DD"
                                            onChange={this.dateStartChange.bind(this)}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                    -
                            </span>
                            </Col>
                            <Col span={7} >
                                <FormItem>
                                {getFieldDecorator('date_end')(
                                    <DatePicker 
                                        placeholder='YYYY-MM-DD'
                                        format="YYYY-MM-DD"
                                        onChange={this.dateEndChange.bind(this)}
                                        disabledDate={this.disabledDate.bind(this)}
                                    />
                                )}
                                </FormItem>
                            </Col>
                        </FormItem>

                            
                        <Col id='psalary' offset={1}>
                            <RadioGroup className='ant-col-offset-5' style={{ marginBottom: 15 }} value={this.state.salary_type} onChange={this.onsalary_typeChange.bind(this)}>
                                <RadioButton value="month">月薪</RadioButton>
                                <RadioButton value="hour">时薪</RadioButton>
                            </RadioGroup>
                            <FormItem label='薪资' labelCol={{ span: 4 }}>
                                <Col span={7} offset={1}>
                                    <FormItem name='salary_start'>
                                    {getFieldDecorator('salary_start', {
                                        initialValue : 1000
                                    })(
                                        <Select onChange={this.onLowSalaryChange.bind(this)}>
                                            {salary_type === 'hour' ? hour_salary.map(h => (<Option key={h.toString()} value={h}>{h}</Option>)) : salary.map(s => (<Option key={s.toString()} value={s}>{s}</Option>))}
                                        </Select>
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                            </span>
                                </Col>
                                <Col span={7} >
                                    <FormItem name='salary_end'>
                                    {getFieldDecorator('salary_end', {initialValue : 5000})(
                                        <Select>
                                            {salary_type === 'hour' ?   hour_salary.map(h => (h > lowSalary && (<Option key={h.toString()} value={h}>{h}</Option>))) : salary.map(s => (s>lowSalary && (<Option key={s.toString()} value={s}>{s}</Option>)))}
                                        </Select>
                                    )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                        <FormItem name='luckyflag' label='红包职位' labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('luckyflag', {
                                initialValue : '1'
                            })(
                                <RadioGroup style={{ marginBottom: 15 }}  onChange={this.changePacket.bind(this)}>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </RadioGroup>
                            )}
                        </FormItem>
                        <Col offset={1} id='pred'>
                            <RadioGroup className='ant-col-offset-5' style={{ marginBottom: 15 }} value={this.state.red_type} onChange={this.changePacketType.bind(this)}>
                                <RadioButton value="normal">普通红包</RadioButton>
                                <RadioButton value="rand">随机红包</RadioButton>
                            </RadioGroup>
                            <FormItem label='红包' labelCol={{ span: 4 }}
                                wrapperCol={{ span: 18, offset: 1 }}>
                                <Col span={7}>
                                    <FormItem name='red_sum'>
                                    {getFieldDecorator('red_sum')(
                                        <Input placeholder='总金额' addonBefore='$' />
                                    )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                        -
                            </span>
                                </Col>
                                <Col span={7} >
                                    <FormItem name='red_count'>
                                    {getFieldDecorator('red_count')(
                                        <InputNumber placeholder='红包个数' max={1000} min={1} default={10}/>
                                    )}
                                    </FormItem>
                                </Col>
                            </FormItem>
                        </Col>
                        <div className='ant-col-offset-6' style={{marginTop : '-23px', marginBottom : 15, color : '#ddd'}}>
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
                                    {welfs.map(w=>(<Option key={w.toString()} value={w}>{w}</Option>))}                                    
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