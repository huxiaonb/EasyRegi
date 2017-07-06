import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { List, InputItem, Button,Picker,DatePicker,Card, Icon} from 'antd-mobile'
import { createForm } from 'rc-form';
import moment from 'moment';

// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Select from 'antd/lib/select'
// import DatePicker from 'antd/lib/date-picker'
// import Card from 'antd/lib/card'
import Upload from 'antd/lib/upload';
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

const maxDate = moment('2017-12-31 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1950-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
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
        previewImage: '',
        fileList:[]
    }

    nextStep(){
        //validateAndSetValue
        let { form } = this.props;
        form.validateFields(async (err, values)=>{
             if (!!err) return
             //set value to context
             let personalInfo = Object.assign({},{
                 name : form.getFieldValue('name'),
                 gender : form.getFieldValue('gender'),
                 folk : form.getFieldValue('folk'),
                 birthDate : form.getFieldValue('birthDate'),
                 healthState : form.getFieldValue('healthState'),
                 idCardNumber : form.getFieldValue('idCardNumber'),
                 homeAddress : form.getFieldValue('homeAddress'),
                 currentAddress : form.getFieldValue('currentAddress'),
                 mobile : form.getFieldValue('mobile'),
                 email : form.getFieldValue('email'),
                 tele : form.getFieldValue('tele'),
                 qqNumber : form.getFieldValue('qqNumber')
             })
             this.context.updateProfile({personalInfo,flag:1});
             this.props.next();
        });
    }
    handleHealthChange(value){
        value==='其他'? this.setState({healthFlag: true}) : this.setState({healthFlag : false});
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
        if(personal.name){
            form.setFieldsValue({
                name : personal.name,
                gender : personal.gender,
                folk : personal.folk,
                birthDate : personal.birthDate,
                healthState : personal.healthState,
                idCardNumber : personal.idCardNumber,
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

    upChange(info){
        let fileList = info.fileList;
        this.setState({fileList});
    }
    beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('Image must smaller than 5MB!');
        }
        return !!isLt2M;
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
        return e;
        }
        return e && e.fileList;
  }
    render(){
        const uploadButton = ( <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>);
        const {getFieldProps, getFieldError } = this.props.form;
        let nationOptions = [],
            {healthFlag,fileList} = this.state;
        for (let key in nations) {
            nationOptions.push({label:nations[key],value:nations[key]})
        }
        let {personal} = this.props;
        return(
        <form key='per-info' style={{textAlign:'center'}}>
        <List >
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
                    alert(getFieldError('name').join('、'));
                }}
                placeholder="请输入姓名"
                >
                姓名
            </InputItem>
            <FormItem
                label="性别"
                name="gender"
                {...getFieldProps('gender', {
                    rules:[{
                        required:true, message:'请选择性别！'
                    }],
                    initialValue:personal.gender || '男'
                })}
                
                >
                
                    <Picker cols={1} data={[{label:'男',value:'男'},{label:'女',value:'女'}]}>
                    <List.Item arrow="horizontal">性别</List.Item>
                    </Picker>
               
            </FormItem>
            <FormItem
                label="民族"
                name="folk"
                {...getFieldProps('folk', {
                    rules:[{
                        required:true, message:'请选择民族！'
                    }],
                    initialValue : personal.folk || '汉族'
                })}
                
                >
                
                    <Picker data={nationOptions}>
                    <List.Item arrow="horizontal">民族</List.Item>
                    </Picker>
                
            </FormItem>
            
            <FormItem
                label="出生日期"
                name='birthDate'
                style={{textAlign:'left'}}
                {...getFieldProps('birthDate', {
                    rules: [{ type:'object', required: true, message: '请选择出生日期!' }],
                    initialValue : personal.date
                })}
                clear
                error={!!getFieldError('birthDate')}
                onErrorClick={() => {
                    alert(getFieldError('birthDate').join('、'));
                }}>
                    <DatePicker mode="date" maxDate={maxDate} minDate={minDate}><List.Item arrow="horizontal">出生日期</List.Item></DatePicker>
            </FormItem>
            <FormItem
                label="健康状况"
                name='healthState'
                {...getFieldProps('healthState', {
                    rules: [{ type:'string', required: true, message: '请选择健康状况!' }],
                    initialValue : personal.healthState || '良好'
                })}
                >
                    <Picker
                        data={[{label:'良好',value:'良好'},{label:'一般',value:'一般'},{label:'其他',value:'其他'}]}>
                        <List.Item arrow="horizontal">健康状况</List.Item>
                    </Picker>
            </FormItem>
            <InputItem
                label="身份证号码"
                name="idCardNumber"
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
                    alert(getFieldError('idCardNumber').join('、'));
                }}
                >
                身份证号码
            </InputItem>
             
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
                    alert(getFieldError('homeAddress').join('、'));
                }}
                >
                家庭住址
            </InputItem>
           <InputItem
                name="currentAddress"
                {...getFieldProps('currentAddress', {
                    rules:[{type:'string'},{
                        required:true,message:'请输入有效的家庭住址！'
                    }],
                    initialValue : personal.currentAddress
                })}
                clear
                error={!!getFieldError('currentAddress')}
                onErrorClick={() => {
                    alert(getFieldError('currentAddress').join('、'));
                }}>
                现住址
            </InputItem>
            
            <InputItem
               name="mobile"
               {...getFieldProps('mobile', {
                    rules: [{
                        type: 'string', pattern: /^[0-9]{11,13}$/, message: '请输入有效的联系手机！'
                    }, {
                        whitespace: true, required: true, message: '请输入有效的联系手机！'
                    }],
                    initialValue : personal.mobile
                })}
                clear
                error={!!getFieldError('mobile')}
                onErrorClick={() => {
                    alert(getFieldError('mobile').join('、'));
                }}
               >
               联系手机          
             </InputItem>
             <InputItem
                name='email'
                {...getFieldProps('email', {
                    rules: [{
                        type: 'email', message: '请输入有效的邮箱!',
                    }, {
                        required: true, message: '请输入有效的邮箱!',
                    }],
                    initialValue : personal.email
                })}
                clear
                error={!!getFieldError('email')}
                onErrorClick={() => {
                    alert(getFieldError('email').join('、'));
                }}
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
                    alert(getFieldError('tele').join('、'));
                }}
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
                    alert(getFieldError('qqNumber').join('、'));
                }}
               >
               QQ             
             </InputItem>
             <FormItem
                label='上传图片'
                name='upload'
                {...getFieldProps('upload',{
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                })}
                >
                
                     <Upload
                        action={`../weChat/applicant/personalInfo/submit/` + openId}
                        name= 'file' 
                        beforeUpload={this.beforeUpload.bind(this)}
                        onChange={this.upChange.bind(this)}    
                        >
                        {fileList.length >= 1 ? null : uploadButton}
                       
                    </Upload>
               
             </FormItem>
        </List>
         <Button type="primary" inline onClick={this.nextStep.bind(this)}>下一步</Button>
        </form>
        )}
}

export default createForm()(PersonalInfo)