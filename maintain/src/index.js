import React from 'react'
import { render } from 'react-dom'

// 引入React-Router模块
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'

// 配置导航
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu

//引入页面组件
import CompInfo from './components/compInfo';
import ApplicantManage from './components/applicantManage';
import ApplicantPreview from './components/applicantPreview';
import PositionManage from './components/positionManage';

import './index.css'
class Index extends React.Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <div>
        <Layout className='main-container'>
          <Header style={{ background: '#fff', padding: 0 }}></Header>
          <Layout style={{position:'relative'}}>
             <Sider>
              <Menu theme="dark" mode="inline"  defaultSelectedKeys={['1']}>
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
            <Content style={{ margin: '24px 16px 0px', padding: 24, background: '#fff' }}>
              { this.props.children }
            </Content>
          </Layout>
          <Footer style={{ textAlign: 'center',padding:0 }}>
            M & G PRESENTS ©2017  (づ￣ 3￣)づ 
          </Footer>
        </Layout>
      </div>
      
    );
  }
}


// 配置路由
render((
    <Router history={hashHistory} >
        <Route path="/" component={Index}>
            <IndexRoute component={CompInfo} />
            <Route path="comp" component={CompInfo} />
            <Route path="applicant" component={ApplicantManage} />
            <Route path="preview" component={ApplicantPreview} />
            <Route path="position" component={PositionManage} />
        </Route>
    </Router>
), document.getElementById('app'));


