import React from 'react';
import ReactDOM from 'react-dom';
import { List, InputItem, Button,Picker,DatePicker,Card, Icon,Toast,Tag} from 'antd-mobile';
import { createForm } from 'rc-form';
import  '../less/basic.less';

const FormItem = List.Item;
const tagStyle = {
    width : '180px',
    fontSize : '20px',
    height : '50px',
    lineHeight : '50px'
};
const tagContet = ['无经验', '电子五金', '模具塑胶', '纺织玩具', '文员行政', '后勤维修', '印刷宣传', '运输装卸', '销售客服', '建筑装潢','财务出纳', '采购跟单'];
class Step3 extends React.Component{
    state={
        skill : ['无经验']
    }
    next(){
        let { form } = this.props;
        let {skill} = this.state;
        let highestDegree = form.getFieldValue('degree').toString();
        let currentAddress = form.getFieldValue('currentAddress');
        form.validateFields(async (err, values)=>{
            if (!!err) {
                Toast.info('请确认信息填写正确！');
            }else{
                this.props.nextStep(3,{highestDegree,currentAddress,skill});
            }
        })
    }
    onChange(count,e){
        let {skill} = this.state;
        if(e){
            this.setState({
                skill : [...skill, tagContet[count]]
            })
        }else{
            let s = skill.filter(s=>s!=tagContet[count]);
            this.setState({
                skill:s
            })
        }
    }
    render(){
        // console.log(this.state.skill);
        let {info} = this.props;
        const {getFieldDecorator,getFieldProps, getFieldError } = this.props.form;
        return(
            <form key='step3' style={{}}>
                <List>
                    <List.Item>                
                        <Picker 
                            cols={1}
                            {...getFieldProps('degree', {
                            rules:[{
                                required:true, message:'请选择最高学历！'
                            }],initialValue:info.highestDegree
                            })}
                            data={[{label:'小学',value:'小学'},{label:'中学',value:'中学'},{label:'高中',value:'高中'},{label:'大专',value:'大专'},{label:'本科',value:'本科'},{label:'硕士',value:'硕士'},{label:'博士',value:'博士'}]}
                            >
                            <List.Item arrow="horizontal" name="degree" style={{padding : 0}}>最高学历</List.Item>
                        </Picker>
                    </List.Item>
                    <div id='caddr'>
                    <InputItem
                        name="currentAddress"
                        {...getFieldProps('currentAddress', {
                            rules:[{required : true,type:'string',message : '请输入有效的现住址！'}],initialValue:info.currentAddress
                        })}
                        clear
                        error={!!getFieldError('currentAddress')}
                        onErrorClick={() => {
                            Toast.info(getFieldError('currentAddress').join('、'));
                        }}
                        placeholder="请输入现住址">
                        现住址
                    </InputItem>
                    </div>
                    <List.Item arrow="horizontal" name="skill" style={{paddingLeft:15}}>技能&经验(多选)
                    <br/>
                        <Tag style={tagStyle} onChange={this.onChange.bind(this,0)} selected>暂无经验</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(1)} onChange={this.onChange.bind(this,1)}>电子五金</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(2)} onChange={this.onChange.bind(this,2)}>模具塑胶</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(3)} onChange={this.onChange.bind(this,3)}>纺织玩具</Tag>
                        <br/>  
                        <Tag style={tagStyle} selected={info.skill.includes(4)} onChange={this.onChange.bind(this,4)}>文员行政</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(5)} onChange={this.onChange.bind(this,5)}>后勤维修</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(6)} onChange={this.onChange.bind(this,6)}>印刷宣传</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(7)} onChange={this.onChange.bind(this,7)}>运输装卸</Tag>
                        <br/>
                        <Tag style={tagStyle} selected={info.skill.includes(8)} onChange={this.onChange.bind(this,8)}>销售客服</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(9)} onChange={this.onChange.bind(this,9)}>建筑装潢</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(10)} onChange={this.onChange.bind(this,10)}>财务出纳</Tag>
                        <Tag style={tagStyle} selected={info.skill.includes(11)} onChange={this.onChange.bind(this,11)}>采购跟单</Tag>
                        <br/>
                    </List.Item>
                        
                </List>
                <Button type="primary" style={{marginTop:'15px', marginLeft:'30px', marginRight:'30px'}} onClick={this.next.bind(this)}>提交</Button>
            </form>
        );
    }
}
export default createForm()(Step3);