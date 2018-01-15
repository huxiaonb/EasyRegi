import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import lapi from '../registerProfile/lapi';
import  '../less/basic.less';

let count = 60;
class Step1 extends React.Component{
    state = {
        verCode : '获取验证码',
        disable : false
    }
    async next(){
        //先检查验证码  再检查信息完整性
        let { form } = this.props;
        let code = form.getFieldValue('code');
        let tele = form.getFieldValue('mobile');
        let name = form.getFieldValue('name');
        const reg = new RegExp("^[0-9]{4,6}$")
        this.props.nextStep();
        if(reg.test(code)){
            let re = await lapi.verifyCaptcha(code);
            if(re.success){
                form.validateFields(async (err, values)=>{
                    if (!!err) {
                        Toast.info('请确认信息填写正确！');
                    }else{
                        this.props.nextStep(1,{name,tele});
                    }
                })
            }else{
                Toast.info('请确认验证码！');
            }
        }else{
            Toast.info('验证码填写错误！');
        }
    }
    async getVerCode(){
        //判断手机号 获取验证码 1分钟倒计时
        let { form } = this.props;
        let mobile = form.getFieldValue('mobile');
        const reg = new RegExp("^[0-9]{11,13}$")
        if(reg.test(mobile)){
            let re = await lapi.getVerCode(mobile);
            if(re.success){
                this.countdown();
            }else{
                Toast.info('请输入有效的手机号码！');
            }
        }else{
            Toast.info('请输入有效的手机号码！');
        }
    }
    countdown(){
        if(count === 0){
            this.setState({
                verCode : '验证码',
                disable : false
            });
            count = 60
            return;
        }else{
            this.setState({
                verCode : --count,
                disable : true
            });
        }
        let that = this;
        setTimeout(function(){
            that.countdown()
        },1000);
    }
    render(){
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        let {disable,verCode} = this.state;
        const bt = (<Button type="primary" disabled = {disable} onClick={this.getVerCode.bind(this)}>{verCode}</Button>)
        return(
            <form key='step1' style={{}}>
                <List >
                    <InputItem
                        style={{textAlign : 'left'}}
                        name='name'
                        {...getFieldProps('name', {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true, message:'请输入有效的姓名！'
                            }]
                        })}
                        clear
                        error={!!getFieldError('name')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('name').join('、'));
                        }}
                        >
                        姓&nbsp;&nbsp;&nbsp;&nbsp;名
                    </InputItem>
                        <InputItem
                            name="mobile"
                            type='money'
                            moneyKeyboardAlign="left"
                            {...getFieldProps('mobile', {
                                    rules: [{
                                        required : true, pattern: /^[0-9]{11,13}$/,  message: '请输入有效的手机号码！'
                                    }, {
                                        whitespace: true,  message: '请输入有效的手机号码！'
                                    }],
                                })}
                                clear
                                error={!!getFieldError('mobile')}
                                onErrorClick={() => {
                                    Toast.info(getFieldError('mobile').join('、'));
                                }}
                            >
                            手&nbsp;&nbsp;&nbsp;&nbsp;机       
                        </InputItem>
                        
                        
                        <div id='xxx'>
                        <InputItem
                                name="code"
                                type='money'
                                moneyKeyboardAlign="left"
                                extra={bt}
                                {...getFieldProps('code', {
                                        rules: [{
                                            required : true, pattern: /^[0-9]{4,6}$/,  message: '请输入有效的验证码！'
                                        }, {
                                            whitespace: true,  message: '请输入有效的验证码！'
                                        }],
                                    })}
                                    clear
                                    error={!!getFieldError('code')}
                                    onErrorClick={() => {
                                        Toast.info(getFieldError('code').join('、'));
                                    }}
                                >
                                验证码       
                            </InputItem>
                        </div>
                        
                </List>
                <Button type="primary" style={{marginTop:'15px', marginLeft:'30px', marginRight:'30px'}} onClick={this.next.bind(this)}>下一步</Button>
            </form>
        );
    }
}
export default createForm()(Step1)