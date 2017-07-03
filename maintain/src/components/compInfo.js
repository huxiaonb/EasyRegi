import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Row, Col,Form,Select} from 'antd'
import PropTypes from 'prop-types';
import api from '../apiCollect'
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
        comp: PropTypes.object
    }
    state = {
        editFlag:false
    }
    async editCompInfo(){
        if(this.state.editFlag){
            let {from} = this.props;
            let compInfo = Object.assign({},{
                companyName: form.getFieldValue('comp_name'),
                alias: form.getFieldValue('comp_alias'),
                companyAddress: form.getFieldValue('comp_addr'),
                companyType: form.getFieldValue('comp_prop'),
                companyScale: form.getFieldValue('comp_size'),
                phoneNumber: form.getFieldValue('comp_phone'),
                contactPersonName: form.getFieldValue('comp_name'),
                email: form.getFieldValue('comp_email'), //必须的
                description: form.getFieldValue('comp_desc'),
            });
            let r = await api.createOrUpdateComp(compInfo);
            message.success('更新成功');
            this.setState({
                editFlag : !this.state.editFlag
            })
        }else{
            this.setState({
                editFlag : !this.state.editFlag
            });
        }
        console.log('123');
    }
    componentWillMount(){
        
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        let infoSection=this.state.editFlag?(
            <div>
            <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_name'
                            label='公司全称'
                            hasFeedback>
                            {getFieldDecorator('comp_name',{
                                rules:[{
                                    type:'string',required:true
                                }]
                            })(
                                <Input className='login-text' placeholder='公司全称'/>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_alias'
                            label='公司简称'
                            hasFeedback>
                            {getFieldDecorator('comp_name',{
                                rules:[{
                                    type:'string'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司简称'/>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_prop'
                            label='公司类型'
                            hasFeedback>
                            {getFieldDecorator('comp_prop',{
                                rules:[{
                                    type:'string',required:true,message:'请选择公司类型'
                                }],initialValue : '国营' 
                            })(
                                <Select>
                                    <Option value="国营">国营</Option>
                                    <Option value="私营">私营</Option>
                                    <Option value="合资">合资</Option>
                                    <Option value="外资">外资</Option>
                                </Select>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_size'
                            label='公司规模'
                            hasFeedback>
                            {getFieldDecorator('comp_size',{
                                rules:[{
                                    type:'email',required:true,message:'请选择公司规模'
                                }],initialValue : '0'
                            })(
                                <Select>
                                    <Option value="1000 人以下">1000 人以下</Option>
                                    <Option value="1000~3000 人">1000~3000 人</Option>
                                    <Option value="3000~5000 人">3000~5000 人</Option>
                                    <Option value="5000 以上">5000 以上</Option>
                                </Select>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_contact_p'
                            label='联系人'
                            hasFeedback>
                            {getFieldDecorator('comp_contact_p',{
                                rules:[{
                                    type:'email',required:true
                                }]
                            })(
                                <Input className='login-text' placeholder='联系人'/>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_phone'
                            label='联系电话'
                            hasFeedback>
                            {getFieldDecorator('comp_phone',{
                                rules:[{
                                    required:true,message:'请输入联系电话！'
                                }]
                            })(
                                <Input className='login-text' type='number' placeholder='联系电话' type='password'/>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <FormItem
                            name='comp_email'
                            label='公司邮箱'
                            hasFeedback>
                            {getFieldDecorator('comp_email',{
                                rules:[{
                                    type:'email',required:true,message:'请输入正确的邮箱!'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司邮箱'/>
                            )}
                        </FormItem>
                        <FormItem
                            name='comp_addr'
                            label='公司地址'
                            hasFeedback>
                            {getFieldDecorator('comp_addr',{
                                rules:[{
                                    type:'string',required:true,message:'请输入正确的公司地址!'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司地址'/>
                            )}
                        </FormItem>
                        
                        

                        <FormItem
                            name='comp_desc'
                            label='公司简介'
                            hasFeedback>
                            {getFieldDecorator('comp_desc',{
                                rules:[{
                                    type:'string'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司简介'/>
                            )}
                        </FormItem></div>)
        : (
            <div>
            <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_name'
                            label='公司全称'
                            hasFeedback>
                            {getFieldDecorator('comp_name',{
                                rules:[{
                                    type:'string',required:true
                                }]
                            })(
                                <Input className='login-text' placeholder='公司全称'/>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_alias'
                            label='公司简称'
                            hasFeedback>
                            {getFieldDecorator('comp_name',{
                                rules:[{
                                    type:'string'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司简称'/>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_prop'
                            label='公司类型'
                            hasFeedback>
                            {getFieldDecorator('comp_prop',{
                                rules:[{
                                    type:'string',required:true,message:'请选择公司类型'
                                }],initialValue : '国营' 
                            })(
                                <Select>
                                    <Option value="国营">国营</Option>
                                    <Option value="私营">私营</Option>
                                    <Option value="合资">合资</Option>
                                    <Option value="外资">外资</Option>
                                </Select>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_size'
                            label='公司规模'
                            hasFeedback>
                            {getFieldDecorator('comp_size',{
                                rules:[{
                                    type:'email',required:true,message:'请选择公司规模'
                                }],initialValue : '0'
                            })(
                                <Select>
                                    <Option value="1000 人以下">1000 人以下</Option>
                                    <Option value="1000~3000 人">1000~3000 人</Option>
                                    <Option value="3000~5000 人">3000~5000 人</Option>
                                    <Option value="5000 以上">5000 以上</Option>
                                </Select>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <Row gutter={40}>
                        <Col span={12}>
                        <FormItem
                            name='comp_contact_p'
                            label='联系人'
                            hasFeedback>
                            {getFieldDecorator('comp_contact_p',{
                                rules:[{
                                    type:'email',required:true
                                }]
                            })(
                                <Input className='login-text' placeholder='联系人'/>
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        <FormItem
                            name='comp_phone'
                            label='联系电话'
                            hasFeedback>
                            {getFieldDecorator('comp_phone',{
                                rules:[{
                                    required:true,message:'请输入联系电话！'
                                }]
                            })(
                                <Input className='login-text' type='number' placeholder='联系电话' type='password'/>
                            )}
                        </FormItem>
                        </Col>
                        </Row>
                        <FormItem
                            name='comp_email'
                            label='公司邮箱'
                            hasFeedback>
                            {getFieldDecorator('comp_email',{
                                rules:[{
                                    type:'email',required:true,message:'请输入正确的邮箱!'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司邮箱'/>
                            )}
                        </FormItem>
                        <FormItem
                            name='comp_addr'
                            label='公司地址'
                            hasFeedback>
                            {getFieldDecorator('comp_addr',{
                                rules:[{
                                    type:'string',required:true,message:'请输入正确的公司地址!'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司地址'/>
                            )}
                        </FormItem>
                        
                        

                        <FormItem
                            name='comp_desc'
                            label='公司简介'
                            hasFeedback>
                            {getFieldDecorator('comp_desc',{
                                rules:[{
                                    type:'string'
                                }]
                            })(
                                <Input className='login-text' placeholder='公司简介'/>
                            )}
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
                                <p className="title">入职员工：10</p>
                            </Col>
                            <Col offset={2} span={9}>
                                <div className="icon-space icon"/>
                                <p className="title">在招职位：5</p>
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