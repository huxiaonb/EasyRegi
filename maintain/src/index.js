import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types';


// 引入React-Router模块
import { Router, Route, Link, hashHistory , IndexRoute, Redirect, IndexLink} from 'react-router'

// 配置导航
import { Layout, Menu, Icon, message } from 'antd';
// import Layout from 'antd/lib/layout'
// import Menu from 'antd/lib/menu'
// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/layout/style/index.less';
// import 'antd/lib/menu/style/index.less';


const { Header, Sider, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu

//引入页面组件
import Login from './components/login'
import CompInfo from './components/compInfo';
import ApplicantManage from './components/applicantManage';
import PositionManage from './components/positionManage';
import Resume from './components/resume';
import Charge from './components/charge';

import './index.less'
import api from './apiCollect'

class Index extends React.Component {
  static childContextTypes = {
        comp: PropTypes.object,
        login: PropTypes.func,
        getCompanyInfo : PropTypes.func
    }

  getChildContext(){
      return {
          comp: this.state.companyInfo,
          login : this.login.bind(this),
          getCompanyInfo : this.getCompInfo.bind(this)
      }
  }
  state = {
    collapsed: false,
    login : false,
    companyInfo: {}
  };
  async logout(){
    let res = await api.logout({});
    let data = await res.json();
    if(data.success && !data.isLogin){
      this.setState({
        login:false
      });
    }
  }
  async login(acc,pwd){
    //get current login company info and set to state as props to children
    if(acc && pwd){
      let res = await api.login({account:acc,pwd:pwd});
      let data = await res.json();
      if(data.success){
        this.setState({
          companyInfo:data.company,
          login : true
        })
      } else if(data.isAccountValid == false){
        message.error('用户名或密码错误');
      } else if(data.isAccountActive == false){
        message.error('账户未激活，请在注册邮箱中查看激活邮件');
      } else {
        message.error('未知错误');
      }
    }
  }
  async getCompInfo(){
    let res = await api.getCompanyInfo({});
    let data = await res.json();
    if(data.success && data.isLogin){
      this.setState({
        companyInfo: data.company,
        login: true
      })
    }
  }
 
  componentWillMount(){
    this.getCompInfo();
  }
  render() {
    let {companyInfo} = this.state;
    return (
      this.state.login ? 
      (<div>
        <Layout className='main-container'>
           <Sider>
           
              <div className='index-logo' />
 
              <Menu theme='dark' mode='inline'>
                <Menu.Item key="1" style={{marginTop: '10px'}}>
                  <Link to='/comp' className="nav-text"><Icon type="info-circle-o" />公司信息</Link>
                </Menu.Item>
                <Menu.Item key="2" style={{marginTop: '10px'}}>
                  <Link to='/applicant' className="nav-text"><Icon type="idcard" />入职员工</Link>
                </Menu.Item>
                <Menu.Item key="3" style={{marginTop: '10px'}}>
                  <Link to='/position' className="nav-text"><Icon type="file" />在招职位</Link>
                </Menu.Item>
                 <Menu.Item key="4" style={{marginTop: '10px'}}>
                  <Link to='/resume' className="nav-text"><Icon type="file-text" />简历池</Link>
                </Menu.Item>
                <Menu.Item key="5" style={{marginTop: '10px'}}>
                  <Link to='/charge' className="nav-text"><Icon type="red-envelope" />充值</Link>
                </Menu.Item>
              </Menu>
            </Sider>
          <Layout style={{position:'relative'}}>
            <Menu mode="horizontal">
              <SubMenu className='user-right' title={<span className='user-right'><Icon type="user" />{companyInfo.alias}</span>}>
                <Menu.Item key="setting:1" onClick={this.logout.bind(this)}>退出</Menu.Item>
              </SubMenu>
            </Menu>
            <Content style={{ margin: '24px 16px 0px', background: '#fff' }}>
              { this.props.children }
            </Content>
            <Footer style={{ textAlign: 'center',padding:0 }}>
              Copyright ©2017 深圳云轻微创科技有限公司 粤ICP备12044479号
            </Footer>
          </Layout>
          
        </Layout>
      </div>) : (<Login/>)
      
    )
  }
}


// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="/" component={Index}>
            <IndexRoute component={CompInfo} />
            <Route path="comp" component={CompInfo} />
            <Route path="applicant" component={ApplicantManage} />
            <Route path="position" component={PositionManage} />
            <Route path="resume" component={Resume} />
            <Route path="charge" component={Charge} />
        </Route>
    </Router>
), document.getElementById('app'));


