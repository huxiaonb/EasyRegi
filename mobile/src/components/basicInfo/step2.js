import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import lapi from '../registerProfile/lapi';

const currentDate = moment().utcOffset(8);
const maxDate = moment('2050-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1950-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const validityMaxDate = moment('2050-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const validityMinDate = moment('1970-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const FormItem = List.Item;

class Step2 extends React.Component{
    async getIdCardInfo() {
        let {form} = this.props;
        let idCardNumReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        let idCardNumber = form.getFieldValue('idCardNumber');
        if(!idCardNumReg.test(idCardNumber)){
            Toast.info('请输入有效的身份证号码！', 1);
            return;
        }
        Toast.loading('载入籍贯...', 5, ()=>{}, true);
        let res = await lapi.getIdCardInfo(idCardNumber);
        if(!!res && res.status == 0){
            console.log(res.result);
            if(!!res.result && !!res.result.area){
                let area = res.result.area.replace(/\s/g, '');
                form.setFieldsValue({
                    nativePlace: area
                });
            }
            if(!!res.result && !!res.result.sex){
                if(res.result.sex == '男' || res.result.sex == '女'){
                    form.setFieldsValue({
                        gender: res.result.sex
                    });
                }
            }
            if(!!res.result && !!res.result.birth){
                let birth = res.result.birth;
                let birthStr = birth.substr(0, 4) + birth.substr(5, 2) + birth.substr(8, 2);
                let birthMo = moment(birth, 'YYYYMMDD').utcOffset(8);
                if(birthMo.isValid()){
                    form.setFieldsValue({
                        birthDate: birthMo
                    });
                }
            }
        }
        Toast.hide();
    }

     next(){
        //获取data传进父元素
        this.props.nextStep();
    }
    render(){
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        return(
            <form key='step2' style={{}}>
                <List >
                    <InputItem
                        name="idCardNumber"
                        onBlur={()=>this.getIdCardInfo()}
                        {...getFieldProps('idCardNumber', {
                                rules: [{
                                    required : true, pattern:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,  message: '请输入有效的身份证号码！'
                                }, {
                                    whitespace: true,  message: '请输入有效的身份证号码！'
                                }],
                            })}
                            clear
                            error={!!getFieldError('idCardNumber')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('idCardNumber').join('、'));
                            }}
                        >
                        身份证号码       
                    </InputItem>
                    <InputItem
                        name="nativePlace"
                        {...getFieldProps('nativePlace', {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,20}$/, message:'请输入有效的籍贯！'
                            },{
                                required:true,message:'请输入有效的籍贯！'
                            }],
                        })}
                        clear
                        error={!!getFieldError('nativePlace')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('nativePlace').join('、'));
                        }}
                        placeholder="请输入籍贯"
                        >
                        籍贯
                    </InputItem>
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps('gender', {
                            rules:[{
                                required:true, message:'请选择性别！'
                            }],
                            })}
                            data={[{label:'男',value:'男'},{label:'女',value:'女'}]}
                            >
                            <List.Item arrow="horizontal" name="gender" style={{padding : 0}}>性别</List.Item>
                        </Picker>
                </FormItem>
                <FormItem
                    label="出生日期"
                    name='birthDate'
                    style={{textAlign:'left'}}
                    >
                        <DatePicker mode="date"
                        {...getFieldProps('birthDate', {
                            rules: [{ type:'object', required: true, message: '请选择出生日期!' }],
                        })} 
                        maxDate={currentDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>出生日期</List.Item></DatePicker>
                </FormItem>
                </List>
                <Button type="primary" style={{marginTop:'15px', marginLeft:'30px', marginRight:'30px'}} onClick={this.next.bind(this)}>下一步</Button>
                </form>
            );
    }
}

export default createForm()(Step2);