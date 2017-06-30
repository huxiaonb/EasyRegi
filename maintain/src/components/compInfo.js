import React from 'react'
import { render } from 'react-dom'
import {Button, Input, DatePicker, Row, Col,Form} from 'antd'
// import Form from 'antd/lib/form'
// import Input from 'antd/lib/input'
// import Button from 'antd/lib/button'
// import Row from 'antd/lib/row'
// import Col from 'antd/lib/col'
// import DatePicker from 'antd/lib/date-picker'


// import 'antd/lib/style/index.less';
// import 'antd/lib/grid/style/index.less';
// import 'antd/lib/input/style/index.less';
// import 'antd/lib/button/style/index.less';
// import 'antd/lib/form/style/index.less';

// import 'antd/lib/date-picker/style/index.less';
import './style/components.less';

import { Link } from 'react-router'

const FormItem = Form.Item;

export default class CompInfo extends React.Component{
    editCompInfo(){
        console.log('123');
    }
    render(){
        return(
            <div className='search-bar-container'>
                <div className='search-title'>
                    公司概况
                </div>
                <div>
                    
                
                <div className='homePage-left-content'>
                    
                    <Row className='inner'>
                            <Col offset={4} span={9}>
                                <div className="icon-user icon"/>
                                <p className="title">入职员工：10</p>
                            </Col>
                            <Col offset={2} span={9}>
                                <div className="icon-space icon"/>
                                <p className="title">在招职位：5</p>
                            </Col>
                        </Row>
                        <div className="entrance-wrap">
                            <Link to="/applicant"><Button size="large" type="ghost">入职员工管理</Button></Link>
                            <Link to="/position"><Button size="large" type="ghost">公司职位管理</Button></Link>
                            <div>
                            <Link to="#"><Button size="large" type="ghost">更改密码</Button></Link>
                            <Link to="#"><Button size="large" type="ghost">others</Button></Link>
                            </div>
                        </div>
                        
                </div>
                <div className='homePage-right-content'>
                    <div className='inner'>
                        <FormItem
                            label="名称"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">狂野的高登</span>
                        </FormItem>
                        <FormItem
                            label="联系电话"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">0756-2238333</span>
                        </FormItem>
                        <FormItem
                            label="公司地址"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">塑料袋飞洛杉矶是劳动法就是辣鸡都放假</span>
                        </FormItem>
                        <FormItem
                            label="邮箱"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">245644@qq.com</span>
                        </FormItem>
                        <FormItem
                            label="联系人"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">付老板</span>
                        </FormItem>
                        <FormItem
                            label="描述"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 16, offset: 1 }}>
                            <span className="content-font">萍聚萍散已看透，自珍自重当坚守，情长情短平常事，何去何从随缘酬，该分手时当分手，留难住处莫强留，隐痛各有春秋疗，从今后远书归梦两幽幽，我会常记先生好，我会常想南山幽，会思念紫竹萧萧月如勾，溪光摇荡屋如舟，会思念那一宵虽短胜一生，青山在绿水流，让你我只记缘来不记仇</span>
                        </FormItem>
                        <FormItem
                            wrapperCol={{ span: 16, offset: 4 }}>
                            <Button className="setting-button" type="ghost" onClick={this.editCompInfo.bind(this)}>修改</Button>
                        </FormItem>
                    </div>
                </div>
                </div>
                
            </div>
        )
    }
}