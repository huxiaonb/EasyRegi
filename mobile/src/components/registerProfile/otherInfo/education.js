import React from 'react';
import ReactDOM from 'react-dom';

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Card from 'antd/lib/card'
import Icon from 'antd/lib/icon'
import Badge from 'antd/lib/badge'
import DatePicker from 'antd/lib/date-picker'


import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/input/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/form/style/index.less';
import 'antd/lib/select/style/index.less';
import 'antd/lib/card/style/index.less';
import 'antd/lib/badge/style/index.less';
import 'antd/lib/date-picker/style/index.less';
import '../../less/ranger-picker.less'


const FormItem = Form.Item;
const {RangePicker } = DatePicker;
const {Option} = Select;
let uuid = 0;
class EduExp extends React.Component {
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
        let {edus, form} = this.props;
        if(edus.length){
            edus.map((wk,idx)=>{
            if(idx){
                form.setFieldsValue({
                    ['title_' + idx] : wk.colledgeName,
                    ['rangeTime_' + idx] : wk.date,
                    ['position_' + idx] : wk.major,
                    ['grad_' + idx] : wk.isGraduated
                })  
            }else{
                form.setFieldsValue({
                    title : wk.colledgeName,
                    rangeTime : wk.date,
                    position : wk.major,
                    grad : wk.isGraduated
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
                <span title='新增的教育经历' style={{color:'#108ee9',cursor:'pointer'}}>
                    新增的教育经历
                </span>
            </Badge>
        )
        let initialValue = [];
        
        this.props.ekeys ? getFieldDecorator('keys', { initialValue: this.props.ekeys }) : getFieldDecorator('keys', { initialValue: [] });
        uuid = this.props.ekeys ? this.props.ekeys.length : 0; 
        const keys = getFieldValue('keys');
        const formItems = keys.map((key, index) => {
            return (
                <Card title={noti} key={`${key}`} style={{marginTop:'20px'}} extra={<span title='删除此列'><Icon onClick={() => this.remove(key)} style={{cursor: 'pointer',transition: 'all .3s'}} type='close'/></span>}>  
                    <FormItem
                        {...formItemLayout}
                        label="学校名称"
                        name={`title_${key}`}
                        hasFeedback
                        key={`title_${key}`}>
                        {getFieldDecorator(`title_${key}`, {
                            rules:[{
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的学校名称！'
                            },{
                                required:true,message:'请输入有效的学校名称！'
                            }]
                        })(
                            <Input placeholder='请输入学校名称！'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="起止日期"
                        name={`rangeTime_${key}`}
                        key={`rangeTime_${key}`}>
                        {getFieldDecorator(`rangeTime_${key}`, {
                             rules: [{ type: 'array', required: true, message: '请选择日期!' }],
                        })(
                            <RangePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="专业"
                        name={`position_${key}`}
                        hasFeedback
                        key={`position_${key}`}>
                        {getFieldDecorator(`position_${key}`, {
                            rules: [{
                                required: true, 
                                whitespace : true,
                                maxLenght : 10,
                                message: '请输入有效的专业！'
                            }]
                        })(
                            <Input placeholder='请输入专业！'/>                        
                    )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="毕业与否"
                        name={`grad_${key}`}
                        hasFeedback
                        key={`grad_${key}`}>
                        {getFieldDecorator(`grad_${key}`, {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }],
                            initialValue:'0'
                        })(
                            <Select>
                                <Option value="0">毕业</Option>
                                <Option value="1">肄业</Option>
                        </Select>
                        )}
                    </FormItem>
                 
                </Card>
            )});
            return(
                <Card title="教育经历">
                    <Form layout='inline' >
                    <Card>
                     <FormItem
                        {...formItemLayout}
                        label="学校名称"
                        name='title'
                        hasFeedback
                        key='title'>
                        {getFieldDecorator('title', {
                            rules:[{
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的学校名称！'
                            },{
                                required:true,message:'请输入有效的学校名称！'
                            }]
                        })(
                            <Input placeholder='请输入学校名称！'/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="起止日期"
                        name='rangeTime'
                        key='rangeTime'>
                        {getFieldDecorator('rangeTime', {
                             rules: [{ type: 'array', required: true, message: '请选择日期!' }],
                        })(
                            <RangePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="专业"
                        name='position'
                        hasFeedback
                        key='position'>
                        {getFieldDecorator('position', {
                            rules: [{
                                required: true, 
                                whitespace : true,
                                maxLenght : 10,
                                message: '请输入有效的专业！'
                            }]
                        })(
                            <Input placeholder='请输入专业！'/>                        
                    )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="毕业与否"
                        name='grad'
                        hasFeedback
                        key='grad'>
                        {getFieldDecorator('grad', {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }],
                            initialValue:'0'
                        })(
                            <Select>
                                <Option value="0">毕业</Option>
                                <Option value="1">肄业</Option>
                        </Select>
                        )}
                    </FormItem>
                    </Card>
                        {formItems}
                    </Form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增教育经历</Button>
                    </div>
                </Card>
            )}
}

export default Form.create()(EduExp)