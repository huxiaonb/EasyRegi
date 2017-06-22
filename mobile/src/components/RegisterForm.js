import React from 'react';
import ReactDOM from 'react-dom';

import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Cascader from 'antd/lib/cascader'
import Layout from 'antd/lib/Layout'

import 'antd/lib/input/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/form/style/index.less';
import 'antd/lib/select/style/index.less';
import 'antd/lib/cascader/style/index.less';
import 'antd/lib/layout/style/index.less';

import district from './district';

const FormItem = Form.Item;
const { Header, Content, Footer, Sider } = Layout;

class RegisterForm extends React.Component {
    constructor(props) {
        super();
    }
    state = {
        province:''
    }

    onChange(value){
        this.setState({
            province : value
        })
    }

    getFormatProv(){
        return district.provinces.map(item => {
            if (!item.children[0].label) {
                return {
                    label:item.label,
                    value:item.value,
                    children:item.children.map(child => ({label:child,value:child}))
                }
            } else {
                return item
            }
        });

    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12, offset: 1 }
        };
        const provinces = this.getFormatProv();
        console.log(provinces);
        return(
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '24px 16px 0' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'center'}}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="联系手机"
                            name="mobile"
                            wrapperCol={{ span: 5, offset: 1 }}
                            hasFeedback
                            >
                            {getFieldDecorator('mobile', {
                                rules: [{
                                    type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                                }, {
                                    required: true, message: '请输入有效的联系手机！'
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="联系座机"
                            name="tele"
                            wrapperCol={{ span: 5, offset: 1 }}
                            hasFeedback
                        >
                            {getFieldDecorator('tele', {
                                rules: [{
                                    type: 'string', pattern: /^([0-9]{3,4}\-)?[0-9]{6,10}(\-[0-9]{1,4})?$/, message: '请输入有效的联系座机！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="传真"
                            name="fax"
                            wrapperCol={{ span: 5, offset: 1 }}
                            hasFeedback
                        >
                            {getFieldDecorator('fax', {
                                rules: [{
                                    type: 'string', pattern: /^([0-9]{3,4}\-)?[0-9]{6,10}(\-[0-9]{1,4})?$/, message: '请输入有效的联系传真！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="城市"
                            name="province"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 5, offset: 1 }}>
                            {getFieldDecorator('province', {
                                rules: [{
                                    type: 'array',  message: '请输入有效的联系城市！'
                                }]
                            })(
                                <Cascader
                                    size='large'
                                    options={provinces}
                                    onChange={this.onChange.bind(this)}
                                    placeholder="Please select"
                                />
                            )}
                        </FormItem>

                        <FormItem
                            label="地址"
                            name="address"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 5, offset: 1 }}
                            hasFeedback>
                            {getFieldDecorator('address', {
                                rules: [{
                                    type: 'string', pattern: /^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message: '请输入有效的地址！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="邮编"
                            name="postcode"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 5, offset: 1 }}
                            hasFeedback>
                            {getFieldDecorator('postcode', {
                                rules: [{
                                    type: 'string', pattern: /^\d{6}$/, message: '请输入有效的邮编！'
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ span: 12, offset: 5 }}>
                            <Button className="setting-button" type="ghost">取消</Button>
                            <Button className="setting-save" type="primary" htmlType="submit" type="primary" >保存</Button>
                        </FormItem>
                    </Form>
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
            
        )
    }
}

export default ($el, args) => {
    RegisterForm = Form.create()(RegisterForm);
    $el.each(function() {ReactDOM.render(<RegisterForm args = { args } />, this);})
}
