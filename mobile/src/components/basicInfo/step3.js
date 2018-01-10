import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast,Tag} from 'antd-mobile';
import { createForm } from 'rc-form';

const FormItem = List.Item;

class Step3 extends React.Component{
    onChange(){
        console.log('111');
    }
    render(){
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        return(
            <form key='step2' style={{}}>
                <List>
                    <FormItem>                
                        <Picker 
                            cols={1}
                            {...getFieldProps('degree', {
                            rules:[{
                                required:true, message:'请选择最高学历！'
                            }],
                            })}
                            data={[{label:'小学',value:'小学'},{label:'中学',value:'中学'},{label:'高中',value:'高中'},{label:'大专',value:'大专'},{label:'本科',value:'本科'},{label:'硕士',value:'硕士'},{label:'博士',value:'博士'}]}
                            >
                            <List.Item arrow="horizontal" name="degree" style={{padding : 0}}>最高学历</List.Item>
                        </Picker>
                    </FormItem>
                    <InputItem
                        name="currentAddress"
                        {...getFieldProps('currentAddress', {
                            rules:[{required : true,type:'string',message : '请输入有效的现住址！'}],
                        })}
                        clear
                        error={!!getFieldError('currentAddress')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('currentAddress').join('、'));
                        }}
                        placeholder="请输入现住址">
                        现住址
                    </InputItem>
                    <FormItem>
                        <List.Item arrow="horizontal" name="degree" style={{padding : 0}}>技能&经验</List.Item>
                        <Tag onChange={::this.onChange} selected>无经验</Tag>
                        <Tag onChange={::this.onChange}>电子五金</Tag>
                        <Tag onChange={::this.onChange}>模具塑胶</Tag>
                        <br/>
                        <Tag onChange={::this.onChange}>纺织玩具</Tag>
                        <Tag onChange={::this.onChange}>文员行政</Tag>
                        <Tag onChange={::this.onChange}>后勤维修</Tag>
                        <br/>
                        <Tag onChange={::this.onChange}>印刷宣传</Tag>
                        <Tag onChange={::this.onChange}>运输装卸</Tag>
                        <Tag onChange={::this.onChange}>销售客服</Tag>
                        <br/>
                        <Tag onChange={::this.onChange}>建筑装潢</Tag>
                        <Tag onChange={::this.onChange}>财务出纳</Tag>
                    </FormItem>
                </List>
            </form>
        );
    }
}
export default createForm()(Step3);