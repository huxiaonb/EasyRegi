import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import PropTypes from 'prop-types';

import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge} from 'antd-mobile';
import  '../../less/index.less';


const FormItem = List.Item;



class EmergencyContact extends React.Component {
    render(){
        let {emergency} = this.props;
        const { getFieldDecorator, getFieldValue, getFieldProps,getFieldError } = this.props.form;
        const noticeB = (
            <Badge dot>
                <span title='紧急联系人(必填)' style={{color:'#108ee9',cursor:'pointer'}} >
                    紧急联系人(必填)
                </span>
            </Badge>
        );
        const relations = [{label:'父母',value:'父母'},{label:'夫妻',value:'夫妻'},{label:'兄弟',value:'兄弟'},{label:'姐妹',value:'姐妹'},{label:'其他',value:'其他'}];
        return(
            <form>
             <Card>
                    <Card.Header title={noticeB} >
                    </Card.Header>
                    <InputItem
                        
                        {...getFieldProps('name', {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/, message:'请输入有效的姓名！'
                            },{
                                required:true, message:'请输入有效的姓名！'
                            }],initialValue : emergency.emergencyContactName
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
                    <FormItem>
                        <Picker 
                            cols={1}
                            {...getFieldProps('relationship', {
                                rules:[{
                                    required:true, message:'请选择关系！'
                                }],initialValue:emergency.emergencycontactrelation || ['父母']
                            })}
                            data={relations}
                            >
                            <List.Item arrow="horizontal" name='relationship' style={{padding : 0}}>关系</List.Item>
                        </Picker>
                    </FormItem>
                    
                    <InputItem
               name="mobile"
               {...getFieldProps('mobile', {
                    rules: [{
                        type: 'string', pattern: /^[0-9]{11,13}$/,  message: '请输入有效的联系电话！'
                    }, {
                        whitespace: true, message: '请输入有效的联系电话！'
                    }],
                    initialValue : emergency.emergencyContactPhoneNumber
                })}
                clear
                error={!!getFieldError('mobile')}
                onErrorClick={() => {
                    Toast.info(getFieldError('mobile').join('、'));
                }}
                placeholder="请输入联系电话"
               >
               联系电话<span className='custom-required'>*</span>          
             </InputItem>
             <InputItem
                name="homeAddress"
                {...getFieldProps('homeAddress', {
                    rules:[{
                        type:'string'
                    },{
                        required:true,message:'请输入有效的住址！'
                    }],
                    initialValue : emergency.emergencyContactAddress
                })}
                clear
                error={!!getFieldError('homeAddress')}
                onErrorClick={() => {
                    Toast.info(getFieldError('homeAddress').join('、'));
                }}
                placeholder="请输入住址"
                >
                住址<span className='custom-required'>*</span>
            </InputItem>
            </Card>
            </form>
        )
    }

}
export default createForm()(EmergencyContact)