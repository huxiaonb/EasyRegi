import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Row, Col,Form,Select,message} from 'antd'
import PropTypes from 'prop-types';
import api from '../apiCollect'
import DistrictSelect from './districtSelect'
import Loading from './Loading'
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Row from 'antd/lib/row'
// import Col from 'antd/lib/col'
// import DatePicker from 'antd/lib/date-picker'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';

// import 'antd/lib/date-picker/style/index.less';
import './style/components.less';

import { Link } from 'react-router'
const Option = Select.Option;
const FormItem = Form.Item;
class CompInfo extends React.Component{
    static contextTypes = {
        comp: PropTypes.object,
        getCompanyInfo : PropTypes.func
    }
    state = {
        loading : false,
        editFlag:false,
        dsArr : [],
        detailAddr : '',
        positionNumber : 0,
        applicantNumber : 0
    }
    async editCompInfo(){
        if(this.state.editFlag){
            let {detailAddr} = this.state;
            let {form} = this.props;
            form.validateFieldsAndScroll(async (err, values)=>{
             if (!!err){
                 return;
             }
            this.setState({loading:true});
            let {pValue, cValue, thirdValue} = this.refs.dSelect.state;
            let dsValue = [];
            pValue ? dsValue.push(pValue) : '';
            cValue ? dsValue.push(cValue) : '';
            thirdValue ? dsValue.push(thirdValue) : '';
            let fullComp = Object.assign({},this.context.comp);
            let compInfo = Object.assign({},fullComp,{
                companyName: form.getFieldValue('comp_name'),
                alias: form.getFieldValue('comp_alias'),
                companyAddress: dsValue.join(',') + ',' + detailAddr,
                companyType: form.getFieldValue('comp_prop'),
                companyScale: form.getFieldValue('comp_size'),
                phoneNumber: form.getFieldValue('comp_phone'),
                contactPersonName: form.getFieldValue('comp_name'),
                email: form.getFieldValue('comp_email'), //必须的
                description: form.getFieldValue('comp_desc'),
            });
            let r = await api.updateComp(compInfo);
            if(r.status === 200){
                message.success('更新成功');
                this.context.getCompanyInfo();
                this.setState({
                    loading :false,
                    dsArr : dsValue,
                    editFlag : !this.state.editFlag
                })
            }
        })
            
            
        }else{
            this.setState({
                editFlag : !this.state.editFlag
            });
        }
    }
    async componentWillMount(){
        try{
            let tArr = [...this.context.comp.companyAddress.split(',')];
            let dAddr = tArr.pop();
            let res = await api.getBasicInfo(this.context.comp._id)
            let data = await res.json();
            this.setState({
                positionNumber : data.positionNumber,
                applicantNumber : data.applicantNumber,
                detailAddr : dAddr,
                dsArr : tArr
            })
        }catch(e){
            console.log(e)
        }
    }
    detailChange(e){
        this.setState({
            detailAddr :　e.target.value
        })
    }
    render(){
        if(this.state.loading){
            return(<div>
                <Loading />
            </div>);
        }
        let {getFieldDecorator} = this.props.form;
        let {comp} = this.context;
        let infoSection=this.state.editFlag?(
            <div className='inner'>
                    <Form>
                        <FormItem
                            name='comp_name'
                            label='公司全称'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_name',{
                                rules:[{
                                    type:'string',required:true,message:'请输入有效的公司全称'
                                }],initialValue:comp.companyName
                            })(
                                <Input className='login-text' placeholder='公司全称'/>
                            )}
                        </FormItem>
                       
                        <FormItem
                            name='comp_alias'
                            label='公司简称'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_alias',{
                                rules:[{
                                    type:'string'
                                }],initialValue:comp.alias
                            })(
                                <Input className='login-text' placeholder='公司简称'/>
                            )}
                        </FormItem>
                        
                        <FormItem
                            name='comp_prop'
                            label='公司类型'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}
                            style={{width:'100%'}}>
                            {getFieldDecorator('comp_prop',{
                                rules:[{
                                    type:'string',required:true,message:'请选择公司类型'
                                }],initialValue:comp.companyType
                            })(
                                <Select>
                                    <Option value="国营">国营</Option>
                                    <Option value="私营">私营</Option>
                                    <Option value="合资">合资</Option>
                                    <Option value="外资">外资</Option>
                                </Select>
                            )}
                        </FormItem>
                        
                        <FormItem
                            name='comp_size'
                            label='公司规模'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_size',{
                                rules:[{
                                    type:'string',required:true,message:'请选择公司规模'
                                }],initialValue:comp.companyScale
                            })(
                                <Select>
                                    <Option value="1000 人以下">1000 人以下</Option>
                                    <Option value="1000~3000 人">1000~3000 人</Option>
                                    <Option value="3000~5000 人">3000~5000 人</Option>
                                    <Option value="5000 以上">5000 以上</Option>
                                </Select>
                            )}
                        </FormItem>
                       
                        <FormItem
                            name='comp_contact_p'
                            label='联系人'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_contact_p',{
                                rules:[{
                                    type:'string',required:true,message:'请输入有效的联系人'
                                }],initialValue:comp.contactPersonName
                            })(
                                <Input className='login-text' placeholder='联系人'/>
                            )}
                        </FormItem>
                        
                        <FormItem
                            name='comp_phone'
                            label='联系电话'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_phone',{
                                rules:[{
                                    required:true,message:'请输入有效的联系电话！'
                                }],initialValue:comp.phoneNumber
                            })(
                                <Input className='login-text' type='number' placeholder='联系电话' />
                            )}
                        </FormItem>
                        
                        <FormItem
                            name='comp_email'
                            label='公司邮箱'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_email',{
                                rules:[{
                                    type:'email',required:true,message:'请输入正确的邮箱!'
                                }],initialValue:comp.email
                            })(
                                <Input className='login-text' placeholder='公司邮箱'/>
                            )}
                        </FormItem>
                        <FormItem
                            name='comp_addr'
                            label='公司地址'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_addr',{
                                rules:[{
                                    type:'string',/*required:true,message:'请输入正确的公司地址!'*/
                                }]
                            })(
                                <div>
                                    <DistrictSelect ref='dSelect' initValue={this.state.dsArr}/>
                                    <div><span>详细地址：</span><Input value={this.state.detailAddr} onChange={this.detailChange.bind(this)} style={{marginTop:'10px',width:'70%'}} placeholder='请输入详细地址'/></div>
                                </div>
                            )}
                        </FormItem>
                        
                        

                        <FormItem
                            name='comp_desc'
                            label='公司简介'
                            hasFeedback
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {getFieldDecorator('comp_desc',{
                                rules:[{
                                    type:'string'
                                }],initialValue:comp.description
                            })(
                                <Input className='login-text' type='textarea' style={{resize:"none"}}/>
                            )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ span: 16, offset: 4 }}>
                            <Button className="setting-button" type="ghost" onClick={this.editCompInfo.bind(this)}>保存</Button>
                        </FormItem></Form></div>)
        : (
            <div className='inner'>
                        <FormItem
                            name='comp_name'
                            label='公司全称'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className=''>{comp.companyName}</span>
                        </FormItem>
                        
                        <FormItem
                            name='comp_alias'
                            label='公司简称'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.alias}
                        </FormItem>
                       
                        
                        <FormItem
                            name='comp_prop'
                            label='公司类型'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.companyType}
                        </FormItem>
                       
                        
                        <FormItem
                            name='comp_size'
                            label='公司规模'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.companyScale}
                        </FormItem>
                        
                        
                        <FormItem
                            name='comp_contact_p'
                            label='联系人'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.contactPersonName}
                        </FormItem>
                        
                        <FormItem
                            name='comp_phone'
                            label='联系电话'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.phoneNumber}
                        </FormItem>
                        
                        <FormItem
                            name='comp_email'
                            label='公司邮箱'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.email}
                        </FormItem>
                        <FormItem
                            name='comp_addr'
                            label='公司地址'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.companyAddress}
                        </FormItem>
                       
                        <FormItem
                            name='comp_desc'
                            label='公司简介'
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            {comp.description}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ span: 16, offset: 4 }}>
                            <Button className="setting-button" type="ghost" onClick={this.editCompInfo.bind(this)}>修改</Button>
                        </FormItem></div>
        );
        return(
            <div className='search-bar-container'>
                <div className='search-title'>
                    公司概况
                </div>
                <div>
                    
                
                <div className='homePage-left-content'>
                    
                    <Row className='inner'>
                            <Col offset={4} span={9}>
                                <div className="icon-user icon"/>
                                <p className="span-title">入职员工：{this.state.applicantNumber}</p>
                            </Col>
                            <Col offset={2} span={9}>
                                <div className="icon-space icon"/>
                                <p className="span-title">在招职位：{this.state.positionNumber}</p>
                            </Col>
                        </Row>
                        <div className="entrance-wrap">
                            <Link to="/applicant"><Button size="large" type="ghost">入职员工管理</Button></Link>
                            <Link to="/position"><Button size="large" type="ghost">公司职位管理</Button></Link>
                            <div>
                            <Link to="#"><Button size="large" type="ghost">更改密码</Button></Link>
                            <Link to="#"><Button size="large" type="ghost">others</Button></Link>
                            </div>
                        </div>
                        
                </div>
                <div className='homePage-right-content'>
                    {infoSection}
                    </div>
                </div>
                </div>
                
        )
    }
}
export default Form.create()(CompInfo)