import React from 'react'
import { render } from 'react-dom'
import {Form, Button, Input, Select, Row, Col,message} from 'antd'
import PropTypes from 'prop-types';
import api from '../apiCollect'
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Select from 'antd/lib/select'
// import Row from 'antd/lib/row'
// import Col from 'antd/lib/col'
// import DatePicker from 'antd/lib/date-picker'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/select/style/index.less';
// import 'antd/lib/form/style/index.less';
// import 'antd/lib/date-picker/style/index.less';
import './style/login.less'

const FormItem = Form.Item;
const Option = Select.Option;
class Login extends React.Component{
    static contextTypes = {
        login: PropTypes.func
    }
    state = {
        registerFlag : false,
    }
    loginTo(){
        let {form} = this.props;
             this.context.login(form.getFieldValue('login_acc'), form.getFieldValue('login_pwd'));
    }
    async register(){
        let {form} = this.props;
        console.log('注册');
        let comp = Object.assign({},{
                companyName: form.getFieldValue('comp_name'),
                password : form.getFieldValue('comp_pwd'),
                alias: form.getFieldValue('comp_alias'),
                companyAddress: form.getFieldValue('comp_addr'),
                companyType: form.getFieldValue('comp_prop'),
                companyScale: form.getFieldValue('comp_size'),
                phoneNumber: form.getFieldValue('comp_phone'),
                contactPersonName: form.getFieldValue('comp_name'),
                email: form.getFieldValue('comp_email'), //必须的
                description: form.getFieldValue('comp_desc'),
            });
            let r = await api.createOrUpdateComp(comp);
            let data = await r.json();
            console.log(data);
            if(r.status === 200){
                message.success('注册成功');
            }
            console.log(r);
    }
    back(){
        this.setState({
            registerFlag : !this.state.registerFlag
        })
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        let {registerFlag} = this.state;
        const loginPage = (
            <div className='login-background'>
                <div className='loginForm'>
                    <h1 className='login-title'>入职易后台管理</h1>
                    <Form>
                        <FormItem
                            name='login_acc'
                            hasFeedback>
                            {getFieldDecorator('login_acc',{
                                rules:[{
                                    type:'email',required:true,message:'请输入正确的邮箱!'
                                }]
                            })(
                                <Input className='login-text' placeholder='登录邮箱'/>
                            )}
                        </FormItem>
                        <FormItem
                            name='login_pwd'
                            hasFeedback>
                            {getFieldDecorator('login_pwd',{
                                rules:[{
                                    required:true,message:'请输入密码！'
                                }]
                            })(
                                <Input className='login-text' placeholder='请输入密码' type='password'/>
                            )}
                        </FormItem>
                    </Form>
                    <div style={{textAlign:'center', marginTop:'15px'}}>
                        <Button type="primary" style={{width:'100%',height:'40px'}} onClick={this.loginTo.bind(this)}>登录</Button>
                    </div>
                    <div className='page-action'>
                        <a  href="javascript:" style={{marginRight:'5px'}} onClick={this.back.bind(this)}>新公司注册</a>
                        <a  href="javascript:" >忘记密码</a>
                    </div>
                </div>
            </div>
        );
        const registerPage = (
            <div className='regis-background'>
                <div className='regisForm'>
                    <h1 className='login-title'>公司注册</h1>
                    <Form>
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
                            {getFieldDecorator('comp_alias',{
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
                                    type:'string',required:true,message:'请选择公司规模'
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
                                    type:'string',required:true
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
                                <Input className='login-text'  placeholder='联系电话' />
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
                            name='comp_pwd'
                            label='登录密码'
                            hasFeedback>
                            {getFieldDecorator('comp_pwd',{
                                rules:[{
                                    type:'string',required:true
                                }]
                            })(
                                <Input className='login-text'/>
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
                        </FormItem>

                    </Form>
                    <div style={{textAlign:'center', marginTop:'15px'}}>
                        <Button type="primary" style={{width:'100%',height:'40px'}} onClick={this.register.bind(this)}>注册</Button>
                    </div>
                    <div className='page-action'>
                        <a  href="javascript:" onClick = {this.back.bind(this)}>返回登录</a>
                    </div>
                </div>
            </div>
        )
        
        return(
            registerFlag ? (registerPage) : (loginPage)
        )
    }
}
export default Form.create()(Login)