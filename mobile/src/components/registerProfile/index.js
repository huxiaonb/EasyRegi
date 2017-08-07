import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {Steps,Button,Toast,Icon} from 'antd-mobile'
import moment from 'moment';
import Loading from '../Loading';
import '../less/index.less'


import PersonalInfo from './personalInfo';
import FamilyInfo from './familyInfo';
import OtherInfo from './otherInfo/index';
import lapi from './lapi'

import 'moment/locale/zh-cn';
moment.locale('zh-cn');


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
      loading : false,
      successFlag : false,
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
    this.setState({loading:true});
    //callApi && if dataObj have date value need change will copy a Object
    let{workExps,edus} = this.state.info.otherInfo;
    if(workExps.length && edus.length){
      let {personal,family} = this.state.info;
      let personalCopy = Object.assign({},personal);
      // let pdate = Object.assign(personalCopy.birthDate,{});
      let appi = Object.assign({},personalCopy,{
        birthDate : personalCopy.birthDate.toDate(),
        validFrom: personalCopy.validFrom.toDate(),
        validTo: personalCopy.validTo.toDate()
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
          degree: ed.degree,
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
      if(r){
        this.setState({successFlag : true,loading:false});
      }else{
        this.setState({loading:false});
      }
    }
    
  }

  async componentWillMount(){
    //0: set wechat id

    //1st: try to get info
    let r = await lapi.getApplicant(openId);
    //2nd : set data
    if(r.length){
        let info = Object.assign({},r[0]);
        let wkeys=[],ekeys=[];
        info.workExperiences.map((wk,idx)=>{
            if(idx){
                wkeys.push(idx);
            }
            wk.startedAt = moment(wk.startedAt);
            wk.endedAt = moment(wk.endedAt);
            info.workExperiences[idx].date = [wk.startedAt,wk.endedAt];
          });
         info.educationHistories.map((ed,idx)=>{
            if(idx){
                ekeys.push(idx);
            }
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
              validFrom: moment(info.validFrom),
              validTo: moment(info.validTo),
              issuingAuthority: info.issuingAuthority,
              nativePlace: info.nativePlace,
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
        <Steps current={current} direction="horizontal" style={{marginBottom:'50px'}}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">
          {steps[this.state.current].content=='0' && <PersonalInfo personal={personal} next={this.next.bind(this)}/>}
          {steps[this.state.current].content=='1' && <FamilyInfo family={family} prev={this.prev.bind(this)} next={this.next.bind(this)}/>}
          {steps[this.state.current].content=='2' && <OtherInfo  otherInfo={otherInfo} prev={this.prev.bind(this)} handleSubmit={this.handleSubmit.bind(this)} />}
        </div>
      
      </div>
    );
    if(this.state.successFlag){
      return(
            <div className="result-example">
                <Result style={{height:'500px',marginTop:'30%'}}
                    img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                    title="操作成功"
                    message="简历已保存"
                />                
            </div>
            );
    }
    if(this.state.loading){
            return(<div>
                <Loading />
            </div>);
        }
    return(
      <div className='ant-layout'>
          {/*<div className='ant-layout-header' style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >编辑个人简历</div>*/}
          <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'center'}}>
              {myStep}
            </div>
          </div>
          <div className='ant-layout-footer' style={{ textAlign: 'center',fontSize: '34px' }}>
              Copyright ©2017 深圳云轻微创科技有限公司 粤ICP备12044479号-3 
          </div>
      </div>
    )
  }
}

export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Index args = { args } />, this);})
}