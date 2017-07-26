import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';
import _ from 'underscore'

import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge, Checkbox } from 'antd-mobile'
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Select from 'antd/lib/select'
// import Card from 'antd/lib/card'
// import Icon from 'antd/lib/icon'
// import Badge from 'antd/lib/badge'
// import Checkbox from 'antd/lib/checkbox'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';
// import 'antd/lib/select/style/index.less';
// import 'antd/lib/card/style/index.less';
// import 'antd/lib/badge/style/index.less';
// import 'antd/lib/checkbox/style/index.less';
import  '../less/index.less';


const FormItem = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
let uuid = 0;
let count = 0;


class FamilyInfo extends React.Component {
    static contextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }
    prevStep(){
        let { form } = this.props;
        form.validateFields(async (err, values)=>{
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
        form.validateFields(async (err, values)=>{
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
        let fms = this.context.profile.family.family.length;
        
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // console.log(keys);
        if(keys.length === 5){
            return;
        }
         if(!uuid){
            uuid = fms ? fms : uuid++;
        }
        uuid ++;
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

   
    componentDidMount(){
        //set value fm.relationship.length ? fm.relationship : [fm.relationship]
        let {form} = this.props;
        let family = this.context.profile.family;
        let fms = family.family;
        if(fms.length){
            fms.map((fm,idx)=>{
            if(idx){
                form.setFieldsValue({
                    ['name_'+ idx]: fm.name,
                    ['relationship_' + idx] : _.isArray(fm.relationship) ? fm.relationship : [fm.relationship],
                    ['mphoneNumber_' + idx] : fm.phoneNumber,
                    ['em_check_' + idx] : fm.emergencyFlag
                })
            }else{
                form.setFieldsValue({
                    name : fm.name,
                    relationship : _.isArray(fm.relationship) ? fm.relationship : [fm.relationship],
                    mphoneNumber : fm.phoneNumber,
                    em_check : fm.emergencyFlag
                })
            }
            })
        }
    }

    render(){
        const relations = [{label:'父母',value:'父母'},{label:'夫妻',value:'夫妻'},{label:'兄弟',value:'兄弟'},{label:'姐妹',value:'姐妹'},{label:'其他',value:'其他'}];
        const { getFieldDecorator, getFieldValue, getFieldProps,getFieldError } = this.props.form;
        
        const noti = (
            <Badge dot>
                <span title='新增的家庭成员' style={{color:'#108ee9',cursor:'pointer'}}>
                    新增的家庭成员
                </span>
            </Badge>
        );
        const notiNodot = (
            <Badge dot>
                <span title='家庭成员(最多6条)' style={{color:'#108ee9',cursor:'pointer'}}>
                    家庭成员(最多6条)
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
                <Card  key={`${key}`} style={{marginTop:'20px'}} >  
                    <Card.Header title={noti} extra={<span title='删除此列'><Icon onClick={() => this.remove(key)} style={{cursor: 'pointer',transition: 'all .3s'}} type='cross'/></span>}>
                    </Card.Header>
                    <InputItem
                        name={`name_${key}`}
                        {...getFieldProps(`name_${key}`, {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true,message:'请输入有效的姓名！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`name_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`name_${key}`).join('、'));
                        }}
                        placeholder="请输入姓名"
                        >
                        <span className='custom-required'>*</span>姓名
                    </InputItem>
                    <FormItem>
                        <Picker 
                            cols={1}
                            {...getFieldProps(`relationship_${key}`, {
                            rules:[{
                                required:true, message:'请选择关系！'
                            }]
                            })}
                            data={relations}
                            >
                            <List.Item arrow="horizontal" name={`relationship_${key}`} style={{padding : 0}}>关系</List.Item>
                        </Picker>
                    </FormItem>
                    <InputItem
                        {...getFieldProps(`mphoneNumber_${key}`, {
                            rules: [{
                                type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                            }, {
                                required: true, message: '请输入有效的联系手机！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`mphoneNumber_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`mphoneNumber_${key}`).join('、'));
                        }}
                        placeholder="请输入联系手机"><span className='custom-required'>*</span>联系手机
                    </InputItem>
                 <FormItem extra={<CheckboxItem {...getFieldProps(`em_check_${key}`, { initialValue: false, valuePropName: 'checked' })} />}>
                    标记为紧急联系人
                 </FormItem>
                </Card>
            )});
        
        
        return(
            <div key='fam_info'>
                <Card>
                    <form>
                    <Card>
                    <Card.Header title={notiNodot} >
                    </Card.Header>
                     <InputItem
                        name="name"
                        {...getFieldProps('name', {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true,message:'请输入有效的姓名！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('name').join('、'));
                        }}
                        placeholder="请输入姓名"
                        >
                        <span className='custom-required'>*</span>姓名
                    </InputItem>
                    
                   
                    <FormItem>
                        <Picker 
                            cols={1}
                            {...getFieldProps('relationship', {
                                rules:[{
                                    required:true, message:'请选择关系！'
                                }],initialValue:['父母']
                            })}
                            data={relations}
                            >
                            <List.Item arrow="horizontal" name='relationship' style={{padding : 0}}>关系</List.Item>
                        </Picker>
                    </FormItem>
                    <InputItem
                        {...getFieldProps('mphoneNumber', {
                            rules: [{
                                type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                            }, {
                                required: true, message: '请输入有效的联系手机！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('mphoneNumber')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('mphoneNumber').join('、'));
                        }}
                        placeholder="请输入联系手机"><span className='custom-required'>*</span>联系手机
                    </InputItem>
                    <FormItem extra={<CheckboxItem {...getFieldProps('em_check', { initialValue: true, valuePropName: 'checked' })} />}>
                        标记为紧急联系人
                    </FormItem>
                    </Card>
                        {formItems}
                    </form>
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

export default createForm()(FamilyInfo)