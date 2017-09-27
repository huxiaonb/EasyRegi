import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast} from 'antd-mobile'
import { createForm } from 'rc-form';
import moment from 'moment';
import ImagePicker from '../ImagePicker';
import  '../less/index.less';
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Select from 'antd/lib/select'
// import DatePicker from 'antd/lib/date-picker'
// import Card from 'antd/lib/card'
import Upload from 'antd/lib/upload';
import lapi from './lapi'
// import Icon from 'antd/lib/icon';
// import Modal from 'antd/lib/modal';
 

// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';
// import 'antd/lib/select/style/index.less';
// import 'antd/lib/date-picker/style/index.less';
// import 'antd/lib/card/style/index.less';
// import 'antd/lib/upload/style/index.less';
// import 'antd/lib/modal/style/index.less';
var today = new Date();
const currentDate = moment().utcOffset(8);
// const currentDate = moment('1997-07-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
console.log(currentDate);
const maxDate = moment('2050-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1950-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const validityMaxDate = moment('2050-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const validityMinDate = moment('1970-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const openId = $('#openId').text();
const FormItem = List.Item;
//const Option = Select.Option;
const nations = ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族",  
               "哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族",  
               "土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族", "乌孜别克族",  
              "俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"];
class PersonalInfo extends React.Component {
    static contextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }
    state={
        healthFlag : false,
        previewVisible: false,
        healthState:['良好'],
        folk:['汉族'],
        gender:['男'],
        marriageState: ['未婚']
    }

    nextStep(){
        //validateAndSetValue
        let { form } = this.props;
        form.validateFields(async (err, values)=>{
             if (!!err) {
                console.log(Object.keys(err));
                let errKeys = Object.keys(err);
                let errMsg = '请填写';
                errKeys.map(function(key){
                    if(key === 'name'){
                        errMsg += '姓名, '
                    }else if(key === 'idCardNumber'){
                        errMsg += '身份证号码, '
                    }else if(key === 'issuingAuthority'){
                        errMsg += '发证机关, '
                    }else if(key === 'nativePlace'){
                        errMsg += '籍贯, '
                    }else if(key === 'validFrom'){
                        errMsg += '身份证有效期开始时间, '
                    }else if(key === 'validTo'){
                        errMsg += '身份证有效期结束时间, '
                    }else if(key === 'homeAddress'){
                        errMsg += '家庭住址, '
                    }else if(key === 'mobile'){
                        errMsg += '手机号码, '
                    }
                });
                if(errMsg !== '请填写'){
                    errMsg = errMsg.substr(0, errMsg.length-2);
                    Toast.info(errMsg, 3);
                }
                return   
             }
             //set value to context
             let personalInfo = Object.assign({},{
                 name : form.getFieldValue('name'),
                 gender : form.getFieldValue('gender'),
                 folk : form.getFieldValue('folk'),
                 birthDate : form.getFieldValue('birthDate'),
                 healthState : form.getFieldValue('healthState'),
                 marriageState : form.getFieldValue('marriageState'),
                 idCardNumber : form.getFieldValue('idCardNumber'),
                 validFrom: form.getFieldValue('validFrom'),
                 validTo: form.getFieldValue('validTo'),
                 issuingAuthority: form.getFieldValue('issuingAuthority'),
                 nativePlace: form.getFieldValue('nativePlace'),
                 homeAddress : form.getFieldValue('homeAddress'),
                 currentAddress : form.getFieldValue('currentAddress'),
                 mobile : form.getFieldValue('mobile'),
                 email : form.getFieldValue('email'),
                 tele : form.getFieldValue('tele'),
                 qqNumber : form.getFieldValue('qqNumber')
             })
             console.log(personalInfo);
             this.context.updateProfile({personalInfo,flag:1});
             this.props.next();
        });
    }
    
/*
    componentWillReceiveProps(){
        debugger;
    }
    shouldComponentUpdate(nextProps) {
        if(nextProps.personal.name){
            this.setFormValue(nextProps.personal);
            return false;
        }else{
            return true
        }
    }
    */
    setFormValue(pers = {}){
        let {form} = this.props;
        let {personal} = this.context.profile;
        if(!personal.name){
            personal = pers;
        }
        //console.log('pe',personal);
        if(personal.name){
            form.setFieldsValue({
                name : personal.name,
                gender : personal.gender,
                folk : personal.folk,
                birthDate : personal.birthDate,
                healthState : personal.healthState,
                marriageState : personal.marriageState,
                idCardNumber : personal.idCardNumber,
                validFrom: personal.validFrom,
                validTo: personal.validTo,
                issuingAuthority: personal.issuingAuthority,
                nativePlace: personal.nativePlace,
                homeAddress : personal.homeAddress,
                currentAddress : personal.currentAddress,
                mobile : personal.mobile,
                email : personal.email,
                tele : personal.tele,
                qqNumber : personal.qqNumber
            });
        }
    }

    componentDidMount(){
        this.setFormValue();
    }

    

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
    
    render(){
        const uploadButton = ( <Button>
                            <Icon type="upload" /> 上传照片
                        </Button>);
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        let nationOptions = [],
            {healthFlag} = this.state;
        for (let key in nations) {
            nationOptions.push({label:nations[key],value:nations[key]})
        }
    
        let {personal} = this.props;
        
        return(
        <form key='per-info' style={{textAlign:'center',fontFamily:'PingFang SC,Helvetica Neue,Hiragino Sans GB,Helvetica,Microsoft YaHei,Arial'}}>
        <List >
            <InputItem
                
                {...getFieldProps('name', {
                    rules:[{
                        type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                    },{
                        required:true, message:'请输入有效的姓名！'
                    }],initialValue : personal.name
                })}
                clear
                error={!!getFieldError('name')}
                onErrorClick={() => {
                    Toast.info(getFieldError('name').join('、'));
                }}
                placeholder="请输入姓名"
                >
                姓名<span className='custom-required'>*</span>
            </InputItem>
            <InputItem
                style={{color:'inherit'}}
                name="idCardNumber"
                onBlur={()=>this.getIdCardInfo()}
                {...getFieldProps('idCardNumber', {
                    rules:[{
                        type:'string', pattern:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, message:'请输入有效的身份证号码！'
                    },{
                        required:true, message:'请输入有效的身份证号码！'
                    }],
                    initialValue : personal.idCardNumber
                })}
                clear
                error={!!getFieldError('idCardNumber')}
                onErrorClick={() => {
                    Toast.info(getFieldError('idCardNumber').join('、'));
                }}
                placeholder="请输入身份证号码"
                >
                身份证号<span className='custom-required'>*</span>
            </InputItem>
             <InputItem
                name="issuingAuthority"
                {...getFieldProps('issuingAuthority', {
                    rules:[{
                        type:'string', pattern:/^[\u4e00-\u9fa5]{1,20}$/, message:'请输入有效的发证机关！'
                    },{
                        required:true,message:'请输入有效的发证机关！'
                    }],initialValue : personal.issuingAuthority
                })}
                clear
                error={!!getFieldError('issuingAuthority')}
                onErrorClick={() => {
                    Toast.info(getFieldError('issuingAuthority').join('、'));
                }}
                placeholder="请输入发证机关"
                >
                发证机关<span className='custom-required'>*</span>
            </InputItem>
            <InputItem
                name="nativePlace"
                {...getFieldProps('nativePlace', {
                    rules:[{
                        type:'string', pattern:/^[\u4e00-\u9fa5]{1,20}$/, message:'请输入有效的籍贯！'
                    },{
                        required:true,message:'请输入有效的籍贯！'
                    }],initialValue : personal.nativePlace
                })}
                clear
                error={!!getFieldError('nativePlace')}
                onErrorClick={() => {
                    Toast.info(getFieldError('nativePlace').join('、'));
                }}
                placeholder="请输入籍贯"
                >
                籍贯<span className='custom-required'>*</span>
            </InputItem>
            <FormItem>
                <DatePicker mode="date"
                    name='validFrom'
                    {...getFieldProps('validFrom', {
                        rules: [{ type:'object', required: true, message: '请选择有效期开始时间!' }],
                        initialValue : personal.validFrom
                    })} 
                    maxDate={validityMaxDate} minDate={validityMinDate}><List.Item arrow="horizontal" style={{padding : 0}}>证件有效期起</List.Item>
                </DatePicker>
            </FormItem>
            <FormItem>
                <DatePicker mode="date"
                    name='validTo'
                    {...getFieldProps('validTo', {
                        rules: [{ type:'object', required: true, message: '请选择有效期结束时间!' }],
                        initialValue : personal.validTo
                    })} 
                    maxDate={validityMaxDate} minDate={validityMinDate}><List.Item arrow="horizontal" style={{padding : 0}}>证件有效期止</List.Item>
                </DatePicker>
            </FormItem>
            <FormItem>                
                    <Picker 
                        cols={1}
                        {...getFieldProps('gender', {
                        rules:[{
                            required:true, message:'请选择性别！'
                        }], initialValue : personal.gender ? [personal.gender] : ['男']
                        })}
                        data={[{label:'男',value:'男'},{label:'女',value:'女'}]}
                        >
                        <List.Item arrow="horizontal" name="gender" style={{padding : 0}}>性别</List.Item>
                    </Picker>
            </FormItem>
            <FormItem>
                    <Picker 
                        cols={1}
                        name="folk"
                        {...getFieldProps('folk', {
                            rules:[{
                                required:true, message:'请选择民族！'
                            }],
                            initialValue : personal.folk ? [personal.folk] : ['汉族']
                        })} 
                        
                        data={nationOptions}>
                    <List.Item arrow="horizontal" style={{padding : 0}}>民族</List.Item>
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
                        initialValue : personal.date || currentDate
                    })} 
                    maxDate={currentDate} minDate={minDate}><List.Item arrow="horizontal" style={{padding : 0}}>出生日期</List.Item></DatePicker>
            </FormItem>
            <FormItem>
                    <Picker
                        cols={1}
                        name='healthState'
                        {...getFieldProps('healthState', {
                            rules: [{ required: true, message: '请选择健康状况!' }],
                            initialValue : personal.healthState ? [personal.healthState] : ['良好']
                        })}
                        data={[{label:'良好',value:'良好'},{label:'一般',value:'一般'},{label:'其他',value:'其他'}]}>
                        <List.Item arrow="horizontal" style={{padding : 0}}>健康状况</List.Item>
                    </Picker>
            </FormItem>
            <FormItem>
                <Picker
                    cols={1}
                    name='marriageState'
                    {...getFieldProps('marriageState', {
                        rules: [{ required: true, message: '请选择婚姻状况!' }],
                        initialValue : personal.marriageState ? [personal.marriageState] : ['未婚']
                    })}
                    data={[{label:'未婚',value:'未婚'},{label:'已婚',value:'已婚'},{label:'离异',value:'离异'},{label:'丧偶',value:'丧偶'}]}>
                    <List.Item arrow="horizontal" style={{padding : 0}}>婚姻状况</List.Item>
                </Picker>
            </FormItem>
            <InputItem
                name="homeAddress"
                {...getFieldProps('homeAddress', {
                    rules:[{
                        type:'string'
                    },{
                        required:true,message:'请输入有效的家庭住址！'
                    }],
                    initialValue : personal.homeAddress
                })}
                clear
                error={!!getFieldError('homeAddress')}
                onErrorClick={() => {
                    Toast.info(getFieldError('homeAddress').join('、'));
                }}
                placeholder="请输入家庭住址"
                >
                家庭住址<span className='custom-required'>*</span>
            </InputItem>
           <InputItem
                name="currentAddress"
                {...getFieldProps('currentAddress', {
                    rules:[{type:'string'}],
                    initialValue : personal.currentAddress
                })}
                clear
                error={!!getFieldError('currentAddress')}
                onErrorClick={() => {
                    Toast.info(getFieldError('currentAddress').join('、'));
                }}
                placeholder="请输入现住址">
                现住址<span className='custom-required'>*</span>
            </InputItem>
            
            <InputItem
               name="mobile"
               {...getFieldProps('mobile', {
                    rules: [{
                        type: 'string', pattern: /^[0-9]{11,13}$/,  message: '请输入有效的联系手机！'
                    }, {
                        whitespace: true, required: true, message: '请输入有效的联系手机！'
                    }],
                    initialValue : personal.mobile
                })}
                clear
                error={!!getFieldError('mobile')}
                onErrorClick={() => {
                    Toast.info(getFieldError('mobile').join('、'));
                }}
                placeholder="请输入联系手机"
               >
               联系手机<span className='custom-required'>*</span>          
             </InputItem>
             <InputItem
                name='email'
                {...getFieldProps('email', {
                    rules: [{
                        type: 'email', message: '请输入有效的邮箱!',
                    }],
                    initialValue : personal.email
                })}
                clear
                error={!!getFieldError('email')}
                onErrorClick={() => {
                    Toast.info(getFieldError('email').join('、'));
                }}
                placeholder="请输入邮箱"
                >
                邮箱
            </InputItem>
            <InputItem
                name="tele"
                {...getFieldProps('tele', {
                    rules: [{
                        type: 'string', pattern: /^([0-9]{3,4}\-)?[0-9]{6,10}(\-[0-9]{1,4})?$/, message: '请输入有效的联系座机！'
                    }],
                    initialValue : personal.tele
                })}
                clear
                error={!!getFieldError('tele')}
                onErrorClick={() => {
                    Toast.info(getFieldError('tele').join('、'));
                }}
                placeholder="请输入联系座机"
                >
                联系座机
            </InputItem>
            <InputItem
               name="qqNumber"
               {...getFieldProps('qqNumber', {
                    rules: [{
                        type: 'string', pattern: /^[0-9]{6,11}$/, message: '请输入有效的QQ！'
                    }],
                    initialValue : personal.qqNumber
                })}
                clear
                error={!!getFieldError('qqNumber')}
                onErrorClick={() => {
                    Toast.info(getFieldError('qqNumber').join('、'));
                }}
                placeholder="请输入QQ"
               >
               QQ             
             </InputItem>
             
        </List>
         <Button type="primary" style={{marginTop:'15px', marginLeft:'30px', marginRight:'30px'}} onClick={this.nextStep.bind(this)}>下一步</Button>
        </form>
        )}
}

export default createForm()(PersonalInfo)