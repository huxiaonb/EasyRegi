import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge, Checkbox } from 'antd-mobile'
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
class WorkExp extends React.Component {
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
        let {workExps, form} = this.props;
        if(workExps.length){
            workExps.map((wk,idx)=>{
                if(idx){
                    form.setFieldsValue({
                        ['title_' + idx] : wk.companyName,
                        ['rangeTime_' + idx] : wk.date,
                        ['position_' + idx] : wk.title,
                        ['salary_' + idx] : wk.salaryRange
                    })  
                }else{
                    form.setFieldsValue({
                        title : wk.companyName,
                        rangeTime : wk.date,
                        position : wk.title,
                        salary : wk.salaryRange
                    })
                }
            });
        }
    }
    
    render(){
         const { getFieldDecorator, getFieldValue,getFieldProps,getFieldError } = this.props.form;
         
        const noti = (
            <Badge dot>
                <span title='新增的工作经历' style={{color:'#108ee9',cursor:'pointer'}}>
                    新增的工作经历
                </span>
            </Badge>
        )

        this.props.wkeys ? getFieldDecorator('keys', { initialValue: this.props.wkeys}) : getFieldDecorator('keys', { initialValue: []});
        //待测：解决刷新之后 再进入页面不能显示多条经历记录  可能导致其他的bug
        uuid = this.props.wkeys ? this.props.wkeys.length : 0;
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
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的公司名称！'
                            },{
                                required:true,message:'请输入有效的公司名称！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`title_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`title_${key}`).join('、'));
                        }}
                        placeholder="请输入公司名称！"
                        >
                        公司名称
                    </InputItem>
                     
                    <FormItem>
                        <DatePicker mode="date"
                            name={`rangeTime_${key}`}
                            {...getFieldProps(`rangeTime_${key}`, {
                                rules: [{ type:'object', required: true, message: '请选择起始日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>起始日期</List.Item>
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name={`rangeTime_end_${key}`}
                            {...getFieldProps(`rangeTime_end_${key}`, {
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
                                message: '请输入有效的职位！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`position_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`position_${key}`).join('、'));
                        }}
                        placeholder="请输入职位！"
                        >
                        职位
                    </InputItem>
                    
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps(`salary_${key}`, {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }]
                            })}
                            data={[{label:'2000以下',value:'2000以下'},{label:'2000~5000',value:'2000~5000'},{label:'5000~8000',value:'5000~8000'},{label:'8000~9999',value:'4000~5000'},{label:'10000以上',value:'10000以上'}]}
                            >
                            <List.Item arrow="horizontal" name="salary" style={{padding : 0}}>薪资范围</List.Item>
                        </Picker>
                    </FormItem> 
                </Card>
            )});
            return(
                
                /* 工作经历 */
                <Card>
                    <Card.Header title="工作经历">
                    </Card.Header>
                    <form>
                    <Card>
                    <InputItem
                        name="title"
                        {...getFieldProps('title', {
                            rules:[{
                                type:'string', pattern:/^[A-Za-z0-9_\u4e00-\u9fa5]{1,50}$/, message:'请输入有效的公司名称！'
                            },{
                                required:true,message:'请输入有效的公司名称！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('title')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('title').join('、'));
                        }}
                        placeholder="请输入公司名称！"
                        >
                        公司名称
                    </InputItem>
                     
                    <FormItem>
                        <DatePicker mode="date"
                            name='rangeTime'
                            {...getFieldProps('rangeTime', {
                                rules: [{ type:'object', required: true, message: '请选择起始日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>起始日期</List.Item>
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name='rangeTime_end'
                            {...getFieldProps('rangeTime_end', {
                                rules: [{ type:'object', required: true, message: '请选择结束日期!' }],
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
                                message: '请输入有效的职位！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('position')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('position').join('、'));
                        }}
                        placeholder="请输入职位！"
                        >
                        职位
                    </InputItem>
                    
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps('salary', {
                            rules:[{
                                required:true, message:'请选择毕业与否！'
                            }]
                            })}
                            data={[{label:'2000以下',value:'2000以下'},{label:'2000~5000',value:'2000~5000'},{label:'5000~8000',value:'5000~8000'},{label:'8000~9999',value:'4000~5000'},{label:'10000以上',value:'10000以上'}]}
                            >
                            <List.Item arrow="horizontal" name="salary" style={{padding : 0}}>薪资范围</List.Item>
                        </Picker>
                    </FormItem>
                    
                    </Card>
                        {formItems}
                    </form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增工作经历</Button>
                    </div>
                </Card>
            )}
}

export default createForm()(WorkExp)