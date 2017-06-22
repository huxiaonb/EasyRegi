import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


import Layout from 'antd/lib/Layout'
import Steps from 'antd/lib/steps'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
import moment from 'moment'

import 'antd/lib/style/index.less';
import 'antd/lib/grid/style/index.less';
import 'antd/lib/layout/style/index.less'
import 'antd/lib/steps/style/index.less';
import 'antd/lib/button/style/index.less';
import 'antd/lib/message/style/index.less';

import PersonalInfo from './personalInfo';
import FamilyInfo from './familyInfo';
import OtherInfo from './otherInfo/index';
import lapi from './lapi'

import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;

const Step = Steps.Step;
const openId = $('#openId').text();
const steps = [{
  title: '基本信息',
  content: '0',
}, {
  title: '家庭信息',
  content: '1',
}, {
  title: '其他信息',
  content: '2',
}];

class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  static childContextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }

  getChildContext(){
      return {
          profile: this.state.info,
          updateProfile : this.updateProfile.bind(this)
      }
  }

  state = {
      current: 0,
      info:{
        personal:{},
        family:{family:[]},
        otherInfo:{workExps:[],wkeys:[],edus:[],ekeys:[]}
      }
    };
  updateProfile(obj){
    let {info} = this.state;
    switch(obj.flag){
      case 1 :
        info = Object.assign(info,{personal : obj.personalInfo})
        break;
      case 2 :
        info = Object.assign(info,{family : {family:obj.family}})
        break;
      case 3 :
        info = Object.assign(info,{otherInfo : obj.otherInfo})
        break;

    }

    this.setState({info:info})
  }  
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  async handleSubmit(){
    //callApi && if dataObj have date value need change will copy a Object
    let{workExps,edus} = this.state.info.otherInfo;
    if(workExps.length && edus.length){
      let {personal,family} = this.state.info;
      let personalCopy = Object.assign({},personal);
      // let pdate = Object.assign(personalCopy.birthDate,{});
      let appi = Object.assign({},personalCopy,{
        birthDate : personalCopy.birthDate.toDate()
      });
      appi.familyMembers = family.family;
      let workExperiences = [],educationHistories = [];
      workExps.map((wkc,idx)=>{
        let wk = Object.assign({},wkc);
        let wdate = [...wk.date];
        let wm = {
          companyName : wk.companyName,
          title : wk.title,
          salaryRange : wk.salaryRange,
          startedAt : wdate[0].toDate(),
          endedAt : wdate[1].toDate()
        };
        workExperiences.push(wm);
      });
      edus.map((edc,idx)=>{
        let ed = Object.assign({},edc);
        let edate = [...ed.date];
        let em = {
          colledgeName : ed.colledgeName,
          major : ed.major,
          isGraduated : ed.isGraduated,
          startedAt : edate[0].toDate(),
          endedAt : edate[1].toDate()
        };
        educationHistories.push(em);
      });
      appi.workExperiences = workExperiences;
      appi.educationHistories = educationHistories;
      /*
        set weChat ID
       */
			if(!!openId){
          appi.wechatOpenId = openId;
      }else{
        	appi.wechatOpenId = '1234';									
					console.log('set Wechat ID');
      }
      console.log(appi);
      let re = await lapi.getApplicant(appi.wechatOpenId);
      let r = re.length ? await lapi.updateApplicant(re[0]._id ,appi) : await lapi.createApplicant(appi)
      console.log(r);
    }
    message.success('Processing complete!');
  }

  async componentWillMount(){
    //0: set wechat id

    //1st: try to get info
    let r = await lapi.getApplicant(openId);
    //2nd : set data
    if(r.length){
        let info = Object.assign({},r[0]);
        let wkeys,ekeys=[];
        info.workExperiences.map((wk,idx)=>{
            wkeys.push(idx);
            wk.startedAt = moment(wk.startedAt);
            wk.endedAt = moment(wk.endedAt);
            info.workExperiences[idx].date = [wk.startedAt,wk.endedAt];
          });
         info.educationHistories.map((ed,idx)=>{
            ekeys.push(idx);
            ed.startedAt = moment(ed.startedAt);
            ed.endedAt = moment(ed.endedAt);
            info.educationHistories[idx].date = [ed.startedAt,ed.endedAt];
          });
          console.log(info.workExperiences,info.educationHistories);
        this.setState({
          info:{
            personal:{
              name : info.name,
              gender : info.gender,
              folk : info.folk,
              date : moment(info.birthDate),
              healthState : info.healthState,
              idCardNumber : info.idCardNumber,
              homeAddress : info.homeAddress,
              currentAddress : info.currentAddress,
              mobile : info.mobile,
              email : info.email,
              tele : info.tele,
              qqNumber : info.qqNumber
            },
            family:{
              family : info.familyMembers
            },
            otherInfo:{
              workExps : info.workExperiences,
              edus : info.educationHistories,
              wkeys:wkeys,
              ekeys:ekeys
            }
          }
        });
        //this.forceUpdate();
    }
  }
  render() {
    const { current } = this.state;
    let { personal, family, otherInfo } = this.state.info;
    const myStep = (
      <div style={{textAlign:'left'}}>
        <Steps current={current} style={{marginBottom:'50px'}}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">
          {steps[this.state.current].content=='0' && <PersonalInfo personal={personal} next={this.next.bind(this)}/>}
          {steps[this.state.current].content=='1' && <FamilyInfo family={family} prev={this.prev.bind(this)} next={this.next.bind(this)}/>}
          {steps[this.state.current].content=='2' && <OtherInfo  otherInfo={otherInfo} prev={this.prev.bind(this)} handleSubmit={this.handleSubmit.bind(this)} />}
        </div>
      
      </div>
    );
    return(
      <Layout>
          <Header style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >入职信息录入</Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'center'}}>
              {myStep}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
              M & G PRESENTS ©2017  (づ￣ 3￣)づ 
          </Footer>
      </Layout>
    )
  }
}

export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Index args = { args } />, this);})
}