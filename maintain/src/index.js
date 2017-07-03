import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types';


// 引入React-Router模块
import { Router, Route, Link, hashHistory , IndexRoute, Redirect, IndexLink} from 'react-router'

// 配置导航
import { Layout, Menu, Icon } from 'antd';
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

import './index.less'
import api from './apiCollect'

class Index extends React.Component {
  static childContextTypes = {
        comp: PropTypes.object,
        login: PropTypes.func
    }

  getChildContext(){
      return {
          comp: this.state.companyInfo,
          login : this.login.bind(this)
      }
  }
  state = {
    collapsed: false,
    login : false,
    companyInfo: {}
  };
  logout(){
    console.log('333');
    this.setState({
      login:false
    })
  }
  async login(acc,pwd){
    //get current login company info and set to state as props to children
    if(acc && pwd){
      let r = await api.login({account:acc,pwd:pwd});
      console.log(r);
      if(r){
        this.setState({
          companyInfo:r,
          login : true
        })
      }
    }
  }
  render() {
    return (
      this.state.login ? 
      (<div>
        <Layout className='main-container'>
           <Sider>
              <div style={{fontSize:'24px',color:'white',margin:'20px 0'}}>入职易</div>
              <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Link to='/comp' className="nav-text">公司信息</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to='/applicant' className="nav-text">入职员工</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to='/position' className="nav-text">在招职位</Link>
                </Menu.Item>
              </Menu>
            </Sider>
          <Layout style={{position:'relative'}}>
            <Menu mode="horizontal">
              <SubMenu className='user-right' title={<span className='user-right'><Icon type="user" />GDGDGD</span>}>
                <Menu.Item key="setting:1" ><span onClick={this.logout.bind(this)}>退出</span></Menu.Item>
              </SubMenu>
            </Menu>
            <Content style={{ margin: '24px 16px 0px', background: '#fff' }}>
              { this.props.children }
            </Content>
            <Footer style={{ textAlign: 'center',padding:0 }}>
              M & G PRESENTS ©2017  (づ￣ 3￣)づ 
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
        </Route>
    </Router>
), document.getElementById('app'));


