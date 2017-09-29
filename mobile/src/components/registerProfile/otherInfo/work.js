import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge, Checkbox } from 'antd-mobile'
import moment from 'moment';
import  '../../less/index.less';
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
const maxDate = moment('2050-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
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
        let {workExps} = this.props;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        console.log(keys);
        if(keys.length === 5){
            return;
        }
         if(!uuid){
            uuid = workExps.length ? workExps.length : uuid++;
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
        let {workExps, form} = this.props;
        if(workExps.length){
            workExps.map((wk,idx)=>{
                form.setFieldsValue({
                        ['title_' + idx] : wk.companyName,
                        ['rangeTime_' + idx] : wk.date[0],
                        ['rangeTime_end_' + idx] : wk.date[1],
                        ['position_' + idx] : wk.title,
                        ['salary_' + idx] : _.isArray(wk.salaryRange) ? wk.salaryRange : [wk.salaryRange],
                        ['resign_' + idx] : wk.resignReason,
                        ['guantor_' + idx] : wk.guarantorName,
                        ['guantor_phone_' + idx] : wk.guarantorPhoneNumber
                    })  
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
        const notiNodot = (
                <span title='教育经历' style={{color:'#108ee9',cursor:'pointer'}}>
                    工作经历
                </span>
        )

        this.props.wkeys ? getFieldDecorator('keys', { initialValue: this.props.wkeys}) : getFieldDecorator('keys', { initialValue: []});
        //待测：解决刷新之后 再进入页面不能显示多条经历记录  可能导致其他的bug
        //uuid = this.props.wkeys ? this.props.wkeys.length : 0;
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
                        公司名称<span className='custom-required'>*</span>
                    </InputItem>
                     
                    <FormItem>
                        <DatePicker mode="date"
                            name={`rangeTime_${key}`}
                            {...getFieldProps(`rangeTime_${key}`, {
                                rules: [{ type:'object', required: true, message: '请选择起始日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>起始日期<span className='custom-required'>*</span></List.Item>
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <DatePicker mode="date"
                            name={`rangeTime_end_${key}`}
                            {...getFieldProps(`rangeTime_end_${key}`, {
                                rules: [{ type:'object', required: true, message: '请选择结束日期!' }],
                            })} 
                            maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>结束日期<span className='custom-required'>*</span></List.Item>
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
                        职位<span className='custom-required'>*</span>
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
                            <List.Item arrow="horizontal" name="salary" style={{padding : 0}}>薪资范围<span className='custom-required'>*</span></List.Item>
                        </Picker>
                    </FormItem> 
                    <InputItem
                        name={`resign_${key}`}
                        {...getFieldProps(`resign_${key}`, {
                            rules: [{
                                required: true, 
                                whitespace : true,
                                message: '请输入有效的离职原因！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`resign_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`resign_${key}`).join('、'));
                        }}
                        placeholder="请输入离职原因！"
                        >
                        离职原因<span className='custom-required'>*</span>
                    </InputItem>
                    <InputItem
                        name={`guantor_${key}`}
                        {...getFieldProps(`guantor_${key}`, {
                            rules: [{
                                
                                whitespace : true,
                                message: '请输入有效的证明人！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`guantor_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`guantor_${key}`).join('、'));
                        }}
                        placeholder="请输入证明人！"
                        >
                        证明人
                    </InputItem>
                    <InputItem
                        name={`guantor_phone_${key}`}
                        {...getFieldProps(`guantor_phone_${key}`, {
                            rules: [{
                               
                                whitespace : true,
                                message: '请输入有效的证明人电话！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`guantor_phone_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`guantor_phone_${key}`).join('、'));
                        }}
                        placeholder="请输入证明人电话！"
                        >
                        证明人电话
                    </InputItem>
                </Card>
            )});
            return(
                
                /* 工作经历 */
                <div>
                    <form>
                        {formItems}
                    </form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增工作经历</Button>
                    </div>
                </div>
            )}
}

export default createForm()(WorkExp)