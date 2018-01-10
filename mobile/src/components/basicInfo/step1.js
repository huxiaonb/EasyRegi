import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast} from 'antd-mobile';
import { createForm } from 'rc-form';

class Step1 extends React.Component{
    next(){
        //获取data传进父元素
        this.props.nextStep();
    }
    render(){
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        return(
            <form key='step1' style={{}}>
                <List >
                    <InputItem
                        
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
                        姓名
                    </InputItem>
                    <InputItem
                        name="mobile"
                        type='money'
                        {...getFieldProps('mobile', {
                                rules: [{
                                    required : true, pattern: /^[0-9]{11,13}$/,  message: '请输入有效的联系电话！'
                                }, {
                                    whitespace: true,  message: '请输入有效的联系电话！'
                                }],
                            })}
                            clear
                            error={!!getFieldError('mobile')}
                            onErrorClick={() => {
                                Toast.info(getFieldError('mobile').join('、'));
                            }}
                        >
                        联系电话       
                    </InputItem>
                </List>
                <Button type="primary" style={{marginTop:'15px', marginLeft:'30px', marginRight:'30px'}} onClick={this.next.bind(this)}>下一步</Button>
            </form>
        );
    }
}
export default createForm()(Step1)