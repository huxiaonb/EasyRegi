import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Picker, Checkbox, Button, WhiteSpace, Result, Icon, Toast} from 'antd-mobile'


import lapi from './registerProfile/lapi'
import './less/index.less'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const CheckboxItem = Checkbox.CheckboxItem;
const FlexItem = Flex.Item;
const openId = $('#openId').text();

class Company extends React.Component{
    state={
        payFlag : false,
        resultPageTitle: '提交成功',//'付款成功',
        bCheck : false,
        mCheck : false,
        selectCompId: '',
        personalInfo: {},
        companies: [],
        currentCompany: [],
        testFamilyMembers: [],
        
        testWorkExperience: [],
        testEducation: [],
        
        salaryRangePickerItem: [],
        relationships: []
    }

  
    async subm(){
        let that = this;
        Toast.loading('Loading...', 0);
        let params = {
            openId: openId,
            selectCompanyId: this.state.selectCompId
        };
        let checkResult = await lapi.checkIfNeedPay(params);

        let data = {
            openId: openId,
            companyId: this.state.selectCompId
        }

        if(checkResult && checkResult.success){
            if(checkResult.needPay){
                let res = await lapi.pay();
                if(res){

                    if(res.return_code === 'SUCCESS'){
                        // alert(JSON.stringify(res));
                        //console.log(res.appid,Date.now().toString(),res.nonce_str,"prepay_id=" + res.prepay_id,res.sign);
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId":res.appid,     //公众号名称，由商户传入
                                "timeStamp":res.timeStamp,         //时间戳，自1970年以来的秒数
                                "nonceStr":res.nonce_str, //随机串
                                "package":"prepay_id=" + res.prepay_id,
                                "signType":"MD5",         //微信签名方式：
                                "paySign":res.paySign //微信签名
                            },
                            async function(res){

                                // alert(JSON.stringify(res));
                                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                    data.payDate = new Date();
                                    let data1 = {};
                                    alert('before');
                                    try {
                                        data1 = {
                                            openId: openId,
                                            companyId: this.state.selectCompId,
                                            payDate: new Date()
                                        };

                                    } catch (e){
                                        alert(e);
                                    }
                                    alert('after');
                                    let r = await lapi.submitSelectComp(data1);
                                    that.setState({
                                        payFlag : true,
                                        resultPageTitle: '付款成功'
                                    });
                                    Toast.hide();
                                }else{
                                    Toast.hide();
                                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。

                            }
                        );
                    }
                } else {
                    Toast.hide();
                }

            } else {
                let submResult = await lapi.submitSelectComp(data);
                this.setState({
                    payFlag : true,
                    resultPageTitle: '提交成功'
                });
                Toast.hide();
            }
        } else {
            Toast.hide();
        }

        
    }
    handleChange(value){
        console.log(value)
        this.setState({
            selectCompId: value
        });
    }
    changeB(e){
        this.setState({
            bCheck: e.target.checked,
        });
    }
    changeM(e){
        this.setState({
            mCheck: e.target.checked,
        });
    }
    onChange = (val) => {
        console.log(val);
    }
    onPickerChange = (val) => {
        console.log(val)
        this.setState({
            selectCompId: val
        })

    }
    async componentWillMount(){
        console.log(openId);
        let r = await lapi.getApplicant(openId);
        let companies = await lapi.getAllCompanyNames();
        console.log(companies);
        if(r.length){
            let info = Object.assign({},r[0]);
            console.log(info)
            this.setState({
                personalInfo: {
                    name: info.name,
                    gender: info.gender,
                    folk: info.folk,
                    birthDate: moment(info.birthDate),
                    healthState: info.healthState,
                    marriageState: info.marriageState,
                    idCardNumber: info.idCardNumber,
                    homeAddress: info.homeAddress,
                    currentAddress : info.currentAddress,
                    mobile : info.mobile,
                    email : info.email,
                    tele : info.tele,
                    qqNumber : info.qqNumber,
                    familyMembers: info.familyMembers,
                    workExperiences: info.workExperiences,
                    educationHistories: info.educationHistories,
                    registeredCompanies: info.registeredCompanies
                },
                testFamilyMembers: info.familyMembers,
                testWorkExperience: info.workExperiences,
                testEducation: info.educationHistories
            })
        }
        if(companies.length){
            var currentCompanyLabel = companies[0].value;
            this.setState({
               companies: companies,
               selectCompId: [currentCompanyLabel]
            });
            
        }
//"付款成功"
    }
    render(){
        let resultPageTitle = this.state.resultPageTitle;
        let resultPage = (
            <div className="result-example">
                <Result style={{height:'500px',marginTop:'30%'}}
                    img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                    title={resultPageTitle}
                    message="简历已提交"
                />                
            </div>
            );
        let {bCheck, mCheck, testFamilyMembers, testWorkExperience, testEducation, salaryRangePickerItem, relationships} = this.state;
        var familyMembersListItems = [], workExperiencesListItems = [], educationListItem = [];
        let bDate = this.state.personalInfo.birthDate ? this.state.personalInfo.birthDate.format('YYYY-MM-DD') : '';
        const familyMemberNum = testFamilyMembers.length;
        testFamilyMembers.map((ele, idx)=>{
            let familyMember = null;
            let relation = relationships.filter((item) => {
                return ele.relationship === item.value;
            });
            if(relation != null && relation != undefined && relation.length > 0){
                relation = relation[0];
            } else {
                relation = {
                    label: '',
                    value: ''
                }
            }
            if(idx === familyMemberNum - 1){
                familyMember = (
                <List key={`familyMember_${ele._id}`}><InputItem
                name="name"
                placeholder=""
                value={ele.name}
                disabled
                >姓名</InputItem>
                <InputItem
                name="relationship"
                placeholder=""
                value={relation.label}
                disabled
                >关系</InputItem>
                <InputItem
                name="phoneNumber"
                placeholder=""
                value={ele.phoneNumber}
                disabled
                >联系电话</InputItem>
                </List>);
            } else {
                familyMember = (
                <List key={`familyMember_${ele._id}`}><InputItem
                name="name"
                placeholder=""
                value={ele.name}
                disabled
                >姓名</InputItem>
                <InputItem
                name="relationship"
                placeholder=""
                value={relation.label}
                disabled
                >关系</InputItem>
                <InputItem
                name="phoneNumber"
                placeholder=""
                value={ele.phoneNumber}
                disabled
                >联系电话</InputItem>
                <WhiteSpace size="lg" />
                </List>);
            }
            if(familyMember != null)
                familyMembersListItems.push(familyMember);
        });
        testWorkExperience.map((ele, idx) => {
            var actualSalaryRange = salaryRangePickerItem.filter((item) =>{
                return item.value === ele.salaryRange;
            });
            if(actualSalaryRange != null && actualSalaryRange != undefined && actualSalaryRange.length > 0){
                actualSalaryRange = actualSalaryRange[0];
            } else {
                actualSalaryRange = {
                    label: '',
                    value: ''
                }
            }
            var startedAt = ele.startedAt, endedAt = ele.endedAt;
            if(startedAt != null && startedAt != undefined){
                startedAt = moment(startedAt).format('YYYY-MM-DD');
            }
            if(endedAt != null && endedAt != undefined){
                endedAt = moment(endedAt).format('YYYY-MM-DD');
            }
            console.log('salary', actualSalaryRange)
            const workExperiences = (
                <List key={`workExperience_${ele._id}`}><InputItem
                    name="workedCompanyName"
                    placeholder=""
                    value={ele.companyName}
                    disabled
                    >公司</InputItem>
                    <InputItem
                    name="companyTitle"
                    placeholder=""
                    value={ele.title}
                    disabled
                    >职位</InputItem>
                    <InputItem
                    name="salaryRange"
                    placeholder=""
                    value={actualSalaryRange.label}
                    disabled
                    >薪资范围</InputItem>
                    <InputItem
                    name="startDate"
                    placeholder=""
                    value={startedAt}
                    disabled
                    >开始时间</InputItem>
                    <InputItem
                    name="endDate"
                    placeholder=""
                    value={endedAt}
                    disabled
                    >结束时间</InputItem>
                    <WhiteSpace size="lg" />
                </List>);
                workExperiencesListItems.push(workExperiences);
        });
        testEducation.map((ele, idx)=>{
            let isGraduated = '毕业';
            if(ele.isGraduated == '1')
                isGraduated = '肄业';
            var startedAt = ele.startedAt, endedAt = ele.endedAt;
            if(startedAt != null && startedAt != undefined){
                startedAt = moment(startedAt).format('YYYY-MM-DD');
            }
            if(endedAt != null && endedAt != undefined){
                endedAt = moment(endedAt).format('YYYY-MM-DD');
            }
             
             
            const educationItem = (
                <List key={`education_${ele._id}`}><InputItem
                    name="colledgeName"
                    placeholder=""
                    value={ele.colledgeName}
                    disabled
                    >学校</InputItem>
                    <InputItem
                    name="major"
                    placeholder=""
                    value={ele.major}
                    disabled
                    >专业</InputItem>
                    <InputItem
                    name="isGraduated"
                    placeholder=""
                    value={isGraduated}
                    disabled
                    >是否毕业</InputItem>
                    <InputItem
                    name="startDate"
                    placeholder=""
                    value={startedAt}
                    disabled
                    >开始时间</InputItem>
                    <InputItem
                    name="endDate"
                    placeholder=""
                    value={endedAt}
                    disabled
                    >结束时间</InputItem>
                    <WhiteSpace size="lg" />
                </List>);
                educationListItem.push(educationItem);
        });

        return(
            <div>
            {this.state.payFlag ? resultPage :
                <div>                    
                {/*<div style={{ height:'64px', lineHeight:'64px', padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'50px'}} >提交入职资料</div>*/}
                <div style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: 'transparent', minHeight: 360 ,textAlign:'center'}}>
                        <Accordion defaultActiveKey="0" className="personalInfoAccordion" onChange={this.personalInfoAccordionChange}>
                            <Accordion.Panel header="个人信息">
                                <List className="personalInfoList">
                                    <InputItem
                                    name="name"
                                    placeholder=""
                                    value={this.state.personalInfo.name}
                                    disabled
                                    >姓名</InputItem>
                                    <InputItem
                                    name="gender"
                                    placeholder=""
                                    value={this.state.personalInfo.gender}
                                    disabled
                                    >性别</InputItem>
                                    <InputItem
                                    name="folk"
                                    placeholder=""
                                    value={this.state.personalInfo.folk}
                                    disabled
                                    >民族</InputItem>
                                    <InputItem
                                    name="birthDate"
                                    placeholder=""
                                    value={bDate}
                                    disabled
                                    >出生日期</InputItem>
                                    <InputItem
                                    name="healthState"
                                    placeholder=""
                                    value={this.state.personalInfo.healthState}
                                    disabled
                                    >健康状况</InputItem>
                                    <InputItem
                                        name="marriageState"
                                        placeholder=""
                                        value={this.state.personalInfo.marriageState}
                                        disabled
                                    >婚姻状况</InputItem>
                                    <InputItem
                                    name="idCardNumber"
                                    placeholder=""
                                    value={this.state.personalInfo.idCardNumber}
                                    disabled
                                    >身份证号</InputItem>
                                    <InputItem
                                    name="homeAddress"
                                    placeholder=""
                                    value={this.state.personalInfo.homeAddress}
                                    disabled
                                    >家庭住址</InputItem>
                                    <InputItem
                                    name="currentAddress"
                                    placeholder=""
                                    value={this.state.personalInfo.currentAddress}
                                    disabled
                                    >现住址</InputItem>
                                    <InputItem
                                    name="mobile"
                                    placeholder=""
                                    value={this.state.personalInfo.mobile}
                                    disabled
                                    >手机号码</InputItem>
                                    <InputItem
                                    name="email"
                                    placeholder=""
                                    value={this.state.personalInfo.email}
                                    disabled
                                    >邮箱</InputItem>
                                    <InputItem
                                    name="tele"
                                    placeholder=""
                                    value={this.state.personalInfo.tele}
                                    disabled
                                    >座机号码</InputItem>
                                    <InputItem
                                    name="qqNumber"
                                    placeholder=""
                                    value={this.state.personalInfo.qqNumber}
                                    disabled
                                    >QQ</InputItem>

                                </List>
                            </Accordion.Panel>
                            <Accordion.Panel header="家庭成员">
                                {familyMembersListItems}
                            </Accordion.Panel>
                            <Accordion.Panel header="工作经历">
                                {workExperiencesListItems}
                            </Accordion.Panel>
                            <Accordion.Panel header="教育经历">
                                {educationListItem}
                            </Accordion.Panel>
                         </Accordion>
            
                         <WhiteSpace size="lg" />
                         <List renderHeader={()=>'选择公司'}>
                        <Picker data={this.state.companies} cols={1} className="all-companies" value={this.state.selectCompId} onPickerChange={this.onPickerChange}>
                            <List.Item arrow="horizontal">公司</List.Item>
                        </Picker>
                        </List>
                        <WhiteSpace size="lg" />
                        <List>    
                        <CheckboxItem  key={0} checked={bCheck} onChange={this.changeB.bind(this)}>承诺填写内容属实</CheckboxItem>
                        <CheckboxItem  key={1} checked={mCheck} onChange={this.changeM.bind(this)}>同意体检不合格不予录取</CheckboxItem>
                        </List>               
                        <WhiteSpace size="lg" />
                        <Button type='primary' inline size="large" disabled={!(bCheck && mCheck)} onClick={this.subm.bind(this)}>提交本人简历</Button>    
                    </div>
                    
                </div>
            
                <div className='ant-layout-footer' style={{ textAlign: 'center',fontSize: '34px' }}>
                    Copyright ©2017 深圳云轻微创科技有限公司 粤ICP备12044479号
                </div>
                </div>}
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Company args = { args } />, this);})
}