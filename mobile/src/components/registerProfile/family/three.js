import React from 'react';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import PropTypes from 'prop-types';

import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast, Badge, Flex, Checkbox } from 'antd-mobile';
import  '../../less/index.less';


const FormItem = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
let uuid = 0;
let count = 0;

class ThreeCategory extends React.Component {
    
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
        let fms = this.props.tc.length;
        
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // console.log(keys);
        if(keys.length === 4){
            return;
        }
         if(!uuid){
            uuid = fms ? fms : uuid++;
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
        //set value fm.relationship.length ? fm.relationship : [fm.relationship]
        let {form} = this.props;
        let fms = this.props.tc;
       
        if(fms.length){
            fms.map((fm,idx)=>{
            if(idx){
                form.setFieldsValue({
                    ['name_'+ idx]: fm.name,
                    ['department' + idx] : fm.department,
                    ['type' + idx] : _.isArray(fm.type) ? fm.type : [fm.type],
                    ['relationship' + idx] : _.isArray(fm.relationship) ? fm.relationship : [fm.relationship],
                    ['employeeNumber_' + idx] : fm.employeeNumber,
                    
                })
            }
            })
        }
    }
    render(){
       
        const { getFieldDecorator, getFieldValue, getFieldProps,getFieldError } = this.props.form;
        const relations = [{label:'父母',value:'父母'},{label:'夫妻',value:'夫妻'},{label:'兄弟',value:'兄弟'},{label:'姐妹',value:'姐妹'},{label:'其他',value:'其他'}];
        const sRelations = [{label:'直系亲属',value:'直系亲属'},{label:'旁系亲属',value:'旁系亲属'}];
        const noticeB = (
            <Badge dot>
                <span title='三类亲(最多4条)' style={{color:'#108ee9',cursor:'pointer'}} >
                    三类亲(最多4条)
                </span>
            </Badge>
        );
        let tc = this.props.tc;
        //render extra
        let initV = [];
        if(tc.length){
            tc.map((f,idx)=>{
                if(idx){
                    initV.push(idx);
                } 
            })
        }
        initV.length ? getFieldDecorator('keys', { initialValue: initV}) : getFieldDecorator('keys', { initialValue: []});
        
        const keys = getFieldValue('keys');
        const formItems = keys.map((key, index) => {
            return (
                
                <Card  key={`${key}`} style={{marginTop:'20px'}} >  
                    <Card.Header title={noticeB} extra={<span title='删除此列'><Icon onClick={() => this.remove(key)} style={{cursor: 'pointer',transition: 'all .3s'}} type='cross'/></span>}>
                    </Card.Header>
 
                    <FormItem>
                    
                        <Picker 
                            cols={1}
                            {...getFieldProps(`type_${key}`, { 
                                rules:[{
                                    required:true, message:'请选择类别！'
                                }]
                            })}
                            data={sRelations}
                            >
                            <List.Item arrow="horizontal" name='sRelations' style={{padding : 0}}>类别<span className='custom-required'>*</span></List.Item>
                        </Picker>
                    </FormItem>
                    <FormItem>
                    
                        <Picker 
                            cols={1}
                            {...getFieldProps(`relationship_${key}`, { 
                                rules:[{
                                    required:true, message:'请选择关系！'
                                }]
                            })}
                            data={relations}
                            >
                            <List.Item arrow="horizontal" name={`relationship_${key}`} style={{padding : 0}}>关系<span className='custom-required'>*</span></List.Item>
                        </Picker>
                    </FormItem>
                     
                    <InputItem
                        name={`employeeNumber_${key}`}
                        {...getFieldProps(`employeeNumber_${key}`, {
                            rules:[{
                                type:'string',pattern: /^[0-9]{4,18}$/,  message:'请输入有效的工号！'
                            },{
                                required:true,message:'请输入有效的工号！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`employeeNumber_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`employeeNumber_${key}`).join('、'));
                        }}
                        placeholder="请输入工号"
                        >
                        工号<span className='custom-required'>*</span>
                    </InputItem>
                    <InputItem
                        name={`name_${key}`}
                        {...getFieldProps(`name_${key}`, {
                            rules:[{
                                type:'string', pattern:/^[\u4e00-\u9fa5]{1,5}$/
                            },{
                                message:'请输入有效的姓名！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`name_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`name_${key}`).join('、'));
                        }}
                        placeholder="请输入姓名"
                        >
                        姓名
                    </InputItem>
                    <InputItem
                        name={`department_${key}`}
                        {...getFieldProps(`department_${key}`, {
                            rules:[{
                                type:'string', 
                            },{
                                message:'请输入有效的部门！'
                            }]
                        })}
                        clear
                        error={!!getFieldError(`department_${key}`)}
                        onErrorClick={() => {
                            Toast.info(getFieldError(`department_${key}`).join('、'));
                        }}
                        placeholder="请输入部门"
                        >
                        部门
                    </InputItem>

                </Card>
            )});
        
        return(
            <div>
                
                    <form>
                    {formItems}
                    </form>
                    <div>
                        <Button type="primary" size='large' icon="plus-circle-o" onClick={this.add.bind(this)} style={{width:'100%'}}>新增三类亲</Button>
                    </div>
                    <div className='re-tips'>
                        <div>三类亲说明：</div>
                        <div>一. 直系亲属：配偶、父母、子女、养父母、养子女、继父母、继子女</div>
                        <div>二. 旁系亲属：包括：</div>
                        <div>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;二等亲属：兄弟姐妹、外祖父母、孙子女、外孙子女及他们的配偶</div>
                        <div>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;三等亲属：叔、伯、姑、舅、姨、侄子女、外甥子女及他们的配偶</div>
                    </div>
            </div>
        );
    }
}
export default createForm()(ThreeCategory)