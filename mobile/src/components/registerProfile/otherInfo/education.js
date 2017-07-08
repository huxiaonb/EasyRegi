import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge, Checkbox } from 'antd-mobile'
import { createForm } from 'rc-form';
import moment from 'moment';
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Select from 'antd/lib/select'
// import Card from 'antd/lib/card'
// import Icon from 'antd/lib/icon'
// import Badge from 'antd/lib/badge'
// import DatePicker from 'antd/lib/date-picker'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';
// import 'antd/lib/select/style/index.less';
// import 'antd/lib/card/style/index.less';
// import 'antd/lib/badge/style/index.less';
// import 'antd/lib/date-picker/style/index.less';
//import '../../less/ranger-picker.less'


const FormItem = List.Item;
const maxDate = moment('2017-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1970-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);

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
                    ['erangeTime_' + idx] : wk.date[0],
                    ['erangeTime_end_' + idx] : wk.date[1],
                    ['position_' + idx] : wk.major,
                    ['grad_' + idx] : wk.isGraduated
                })  
            }else{
                form.setFieldsValue({
                    title : wk.colledgeName,
                    erangeTime : wk.date[0],
                    erangeTime_end : wk.date[1],
                    position : wk.major,
                    grad : wk.isGraduated
                })
            }
            })
        }
    }
    validateFDate(rule, value, callback){
        let sDate = this
    }
    render(){
         const { getFieldDecorator, getFieldValue,getFieldProps,getFieldError } = this.props.form;
         
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
                <Card  key={`${key}`} style={{marginTop:'20px'}}>  
                    <Card.Header title={noti} extra={<span title='删除此列'><Icon onClick={() => this.remove(key)} style={{cursor: 'pointer',transition: 'all .3s'}} type='cross'/></span>}>
                    </Card.Header>
                    <InputItem
                        name={`title_${key}`}
                        {...getFieldProps(`title_${key}`, {
                            rules:[{
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的学校名称！'
                            },{
                                required:true,message:'请输入有效的学校名称！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`title_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`title_${key}`).join('、'));
                        }}
                        placeholder="请输入学校名称！"
                        >
                        姓名
                    </InputItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name={`erangeTime_${key}`}
                            {...getFieldProps(`erangeTime_${key}`, {
                                rules: [{ type:'object', required: true, message: '请选择起始日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>起始日期</List.Item>
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name={`erangeTime_end_${key}`}
                            {...getFieldProps(`erangeTime_end_${key}`, {
                                rules: [{ type:'object', required: true, message: '请选择结束日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>结束日期</List.Item>
                        </DatePicker>
                     </FormItem>
                    
                    <InputItem
                        name={`position_${key}`}
                        {...getFieldProps(`position_${key}`, {
                            rules: [{
                                required: true, 
                                whitespace : true,
                                maxLenght : 10,
                                message: '请输入有效的专业！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`position_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`position_${key}`).join('、'));
                        }}
                        placeholder="请输入专业！"
                        >
                        专业
                    </InputItem>
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps(`grad_${key}`, {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }]
                            })}
                            data={[{label:'毕业',value:'毕业'},{label:'肄业',value:'肄业'}]}
                            >
                            <List.Item arrow="horizontal" name={`grad_${key}`} style={{padding : 0}}>毕业</List.Item>
                        </Picker>
                    </FormItem>
                </Card>
            )});
            return(
                <Card title="教育经历">
                    <form>
                    <Card>
                    <InputItem
                        name="title"
                        {...getFieldProps('title', {
                            rules:[{
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的学校名称！'
                            },{
                                required:true,message:'请输入有效的学校名称！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('title')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('title').join('、'));
                        }}
                        placeholder="请输入学校名称！"
                        >
                        姓名
                    </InputItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name='erangeTime'
                            {...getFieldProps('erangeTime', {
                                rules: [
                                        { type:'object', required: true, message: '请选择起始日期!' },
                                        { validator: this.validateFDate.bind(this)}
                                    ],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>起始日期</List.Item>
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name='erangeTime_end'
                            {...getFieldProps('erangeTime_end', {
                                rules: [{ type:'object', required: true, message: '请选择结束日期!' },{ validator: this.validateSDate.bind(this)}],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>结束日期</List.Item>
                        </DatePicker>
                     </FormItem>
                    
                    <InputItem
                        name="position"
                        {...getFieldProps('position', {
                            rules: [{
                                required: true, 
                                whitespace : true,
                                maxLenght : 10,
                                message: '请输入有效的专业！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('position')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('position').join('、'));
                        }}
                        placeholder="请输入专业！"
                        >
                        专业
                    </InputItem>
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps('grad', {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }]
                            })}
                            data={[{label:'毕业',value:'毕业'},{label:'肄业',value:'肄业'}]}
                            >
                            <List.Item arrow="horizontal" name="grad" style={{padding : 0}}>毕业</List.Item>
                        </Picker>
                    </FormItem>
                    </Card>
                        {formItems}
                    </form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增教育经历</Button>
                    </div>
                </Card>
            )}
}

export default createForm()(EduExp)