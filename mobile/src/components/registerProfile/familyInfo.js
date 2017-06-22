import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Card from 'antd/lib/card'
import Icon from 'antd/lib/icon'
import Badge from 'antd/lib/badge'
import Checkbox from 'antd/lib/checkbox'


import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/input/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/form/style/index.less';
import 'antd/lib/select/style/index.less';
import 'antd/lib/card/style/index.less';
import 'antd/lib/badge/style/index.less';
import 'antd/lib/checkbox/style/index.less';



const FormItem = Form.Item;
const {Option} = Select;
let uuid = 0;
let count = 0;


class FamilyInfo extends React.Component {
    static contextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }
    prevStep(){
        let { form } = this.props;
        form.validateFieldsAndScroll(async (err, values)=>{
             if (!!err){
                 this.props.prev();
             }  
             //set value to context
             let familyInfos = [Object.assign({},{
                 name : form.getFieldValue('name'),
                 relationship : form.getFieldValue('relationship'),
                 phoneNumber : form.getFieldValue('mphoneNumber'),
                 emergencyFlag : form.getFieldValue('em_check')
             })];
             const keys = form.getFieldValue('keys');
             keys.map((key, index) => {
                 let fmObj = Object.assign({},{
                     name : form.getFieldValue('name_'+ key),
                     relationship : form.getFieldValue('relationship_' + key),
                     phoneNumber : form.getFieldValue('mphoneNumber_' + key),
                     emergencyFlag : form.getFieldValue('em_check_' + key)
                 });
                 familyInfos.push(fmObj);
             });
             this.context.updateProfile({family:familyInfos, flag:2});
             this.props.prev();
        });
       
    }

    nextStep(){
        //validate form value and set data
        let { form } = this.props;
        form.validateFieldsAndScroll(async (err, values)=>{
             if (!!err) return
             //set value to context
             let familyInfos = [Object.assign({},{
                 name : form.getFieldValue('name'),
                 relationship : form.getFieldValue('relationship'),
                 phoneNumber : form.getFieldValue('mphoneNumber'),
                 emergencyFlag : form.getFieldValue('em_check')
             })];
             const keys = form.getFieldValue('keys');
             keys.map((key, index) => {
                 let fmObj = Object.assign({},{
                     name : form.getFieldValue('name_'+ key),
                     relationship : form.getFieldValue('relationship_' + key),
                     phoneNumber : form.getFieldValue('mphoneNumber_' + key),
                     emergencyFlag : form.getFieldValue('em_check_' + key)
                 });
                 familyInfos.push(fmObj);
             });
             this.context.updateProfile({family:familyInfos, flag:2});
             this.props.next()
        });
    }

    remove(k){
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
            return;
        }
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add(){
        uuid++;
        if(uuid>5) return;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

   
    componentDidMount(){
        //set value
        let {form} = this.props;
        let family = this.context.profile.family;
        let fms = family.family;
        if(fms.length){
            fms.map((fm,idx)=>{
            if(idx){
                form.setFieldsValue({
                    ['name_'+ idx]: fm.name,
                    ['relationship_' + idx] : fm.relationship,
                    ['mphoneNumber_' + idx] : fm.phoneNumber,
                    ['em_check_' + idx] : fm.emergencyFlag
                })
            }else{
                form.setFieldsValue({
                    name : fm.name,
                    relationship : fm.relationship,
                    mphoneNumber : fm.phoneNumber,
                    em_check : fm.emergencyFlag
                })
            }
            })
        }
    }

    render(){
        const { getFieldDecorator, getFieldValue  } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
                md: {span:12}
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
                md: {span:12}
            },
        };
        const noti = (
            <Badge dot>
                <span title='新增的家庭成员' style={{color:'#108ee9',cursor:'pointer'}}>
                    家庭成员
                </span>
            </Badge>
        )
        let family = this.context.profile.family.family;
        //render extra
        let initV = [];
        if(family.length){
            family.map((f,idx)=>{
                if(idx){
                    initV.push(idx);
                } 
            })
        }
        initV.length ? getFieldDecorator('keys', { initialValue: initV}) : getFieldDecorator('keys', { initialValue: []});
        
        const keys = getFieldValue('keys');
        const formItems = keys.map((key, index) => {
            return (
                <Card title={noti} key={`${key}`} style={{marginTop:'20px'}} extra={<span title='删除此列'><Icon onClick={() => this.remove(key)} style={{cursor: 'pointer',transition: 'all .3s'}} type='close'/></span>}>  
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                        name={`name_${key}`}
                        hasFeedback
                        key={`name_${key}`}>
                        {getFieldDecorator(`name_${key}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true, message:'请输入有效的姓名！'
                            }]
                        })(
                            <Input placeholder='请输入姓名！'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="关系"
                        name={`relationship_${key}`}
                        hasFeedback
                        key={`relationship_${key}`}>
                        {getFieldDecorator(`relationship_${key}`, {
                            rules:[{
                                required:true, message:'请选择关系！'
                            }],
                            initialValue:'父母'
                        })(
                            <Select>
                                <Option value="parents">父母</Option>
                                <Option value="bros">兄弟</Option>
                                <Option value="sis">姐妹</Option>
                                <option value="other">其他亲属</option>
                        </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系手机"
                        name={`mphoneNumber_${key}`}
                        hasFeedback
                        key={`mphoneNumber_${key}`}>
                        {getFieldDecorator(`mphoneNumber_${key}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                            }, {
                                required: true, message: '请输入有效的联系手机！'
                            }]
                        })(
                            <Input placeholder='请输入联系手机！'/>                        
                    )}
                    </FormItem>
                 <FormItem
                        label=''
                        name={`em_check_${key}`}>
                        {getFieldDecorator(`em_check_${key}`,{
                            valuePropName: 'checked',
                            initialValue: false
                        })(
                            <Checkbox>
                                标记为紧急联系人
                            </Checkbox>
                        )}
                    </FormItem>
                </Card>
            )});
        
        
        return(
            <div key='fam_info'>
                <Card title="家庭成员(最多6条)">
                    <Form layout='inline'>
                    <Card>
                     <FormItem
                     {...formItemLayout}
                        label="姓名"
                        name='name'
                        hasFeedback
                        key='name'>
                        {getFieldDecorator('name', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true,message:'请输入有效的姓名！'
                            }]
                        })(
                            <Input placeholder='请输入姓名！'/>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="关系"
                        name='relationship'
                        hasFeedback
                        key='relationship'>
                        {getFieldDecorator('relationship', {
                            rules:[{
                                required:true, message:'请选择关系！'
                            }],
                            initialValue:'parents'
                        })(
                            <Select>
                                <Option value="parents">父母</Option>
                                <Option value="bros">兄弟</Option>
                                <Option value="sis">姐妹</Option>
                                <Option value="other">其他亲属</Option>
                        </Select>
                        )}
                    </FormItem>
                    <FormItem
                    {...formItemLayout}
                        label="联系手机"
                        name='mphoneNumber'
                        key='mphoneNumber'
                        hasFeedback>
                        {getFieldDecorator('mphoneNumber', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                            }, {
                                required: true, message: '请输入有效的联系手机！'
                            }]
                        })(
                            <Input placeholder='请输入联系手机！'/>                        
                    )}
                    </FormItem>
                    <FormItem
                        label=''
                        name='em_check'>
                        {getFieldDecorator('em_check',{
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>
                                标记为紧急联系人
                            </Checkbox>
                        )}
                    </FormItem>
                    </Card>
                        {formItems}
                    </Form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增家庭成员</Button>
                    </div>
                </Card>
                <div style={{textAlign:'center', marginTop:'15px'}}>
                    <Button style={{ marginRight: 8 }} onClick={this.prevStep.bind(this)}>上一步</Button>
                    <Button type="primary" onClick={this.nextStep.bind(this)}>下一步</Button>
                </div>
                </div>
        )
    }
}

export default Form.create()(FamilyInfo)