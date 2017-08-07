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
        bCheck : false,
        mCheck : false,
        selectCompId: '',
        personalInfo: {},
        companies: [{value: '123', label: 'OOCL'},{value: '金山', label: '金山'}, {value: '西山居', label: '西山居'}],
        currentCompany: ['123'],
        testFamilyMembers: [{_id:'qwer', name:'付雷',relationship:'父母',phoneNumber:'12345678902'},{_id:'safd', name:'黄俊',relationship:'父母',phoneNumber:'12345678903'}],
        testThreeTypesRelations: {_id:'qwer', name:'付雷',relationship:'父母',phoneNumber:'12345678902'},
        testWorkExperience: [{_id:'work_adsf', companyName: '金山', title: '前端工程师', salaryRange: '5', startedAt: '2016-09-01', endedAt: '2017-07-02'}, {_id:'work_asdfg', companyName: 'OOCL', title: '软件工程师', salaryRange: '4', startedAt: '2014-12-01', endedAt: '2016-08-30'}],
        testEducation: [{_id:'education_adsf', colledgeName: '澳门大学', major: '软件工程', isGraduated: '0', startedAt: '2011-09-01', endedAt: '2014-07-01'}, {_id:'education_adsfh', colledgeName: '澳门科技大学', major: '软件技术', isGraduated: '0', startedAt: '2007-09-01', endedAt: '2011-07-01'}],
        testEmergencyContact: {_id:'asdf', name:'付大军',relationship:'兄弟',phoneNumber:'12345678905'},
        salaryRangePickerItem: [{value: '0', label: '2000以下'}, {value: '1', label: '2000~3000'}, {value: '2', label: '3000~4000'}, {value: '3', label: '4000~5000'}, {value: '4', label: '5000~10000'}, {value: '5', label: '10000以上'}],
        relationships: [{value: 'parents', label: '父母'}, {value: 'couple', label: '夫妻'}, {value: 'bros', label: '兄弟'}, {value: 'sis', label: '姐妹'}, {value: 'other', label: '其他亲属'}]
    }

  
    async subm(){
        Toast.loading('Loading...', 0);
        
        let res = await lapi.pay();
        let that = this;
        if(res){
            
            if(res.return_code === 'SUCCESS'){
                //alert(JSON.stringify(res));
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
                        
                            //alert(JSON.stringify(res));   
                            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                                var data = {
                                openId: openId,
                                companyId: this.state.selectCompId
                            }
                            let r = await lapi.submitSelectComp(data);
                        
                            that.setState({
                                payFlag : true,
                            });
                            Toast.hide();
                            //console.log('成功啦！')
                        }else{
                            Toast.hide();
                        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                        
                    }
                ); 
            }
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

    }
    render(){ 
        let resultPage = (
            <div className="result-example">
                <Result style={{height:'500px',marginTop:'30%'}}
                    img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                    title="付款成功"
                    message="简历已提交"
                />                
            </div>
            );
        let {bCheck, mCheck, testFamilyMembers, testWorkExperience, testEducation, testThreeTypesRelations, testEmergencyContact, salaryRangePickerItem, relationships} = this.state;
        var familyMembersListItems = [], workExperiencesListItems = [], educationListItem = [];
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
                startedAt = startedAt.substr(0, 10);
            }
            if(endedAt != null && endedAt != undefined){
                endedAt = endedAt.substr(0, 10);
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
                startedAt = startedAt.substr(0, 10);
            }
            if(endedAt != null && endedAt != undefined){
                endedAt = endedAt.substr(0, 10);
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
                                    value={this.state.personalInfo.birthDate}
                                    disabled
                                    >出生日期</InputItem>
                                    <InputItem
                                    name="healthState"
                                    placeholder=""
                                    value={this.state.personalInfo.healthState}
                                    disabled
                                    >健康状况</InputItem>
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
                        <CheckboxItem  key={0} checked={bCheck} onChange={this.changeB.bind(this)}>个人保证已填写资料属实并同意体检不合格时不予录用</CheckboxItem>
                        <CheckboxItem  key={1} checked={mCheck} onChange={this.changeM.bind(this)}>支付1元支持入职易</CheckboxItem>
                        </List>               
                        <WhiteSpace size="lg" />
                        <Button type='primary' inline size="large" disabled={!(bCheck && mCheck)} onClick={this.subm.bind(this)}>提交本人简历</Button>    
                    </div>
                    
                </div>
            
                <div className='ant-layout-footer' style={{ textAlign: 'center' }}>
                    M & G PRESENTS ©2017  (づ￣ 3￣)づ 
                </div>
                </div>}
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Company args = { args } />, this);})
}