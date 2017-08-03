import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button} from 'antd-mobile';
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Positions extends React.Component{
    state = {
        geolocation : {},
        nearbyPositions : []
    }
    async componentWillMount(){
        console.log('componentWillMount')
        let info = this.props.args;
        // let addrArr = [];
        // if(info != null && info != undefined){
        //     if(info.province != null && info.province != undefined && info.province != '')
        //         addrArr.push(info.province);
        //     if(info.city != null && info.city != undefined && info.city != '')
        //         addrArr.push(info.city);
        //     if(info.district != null && info.district != undefined && info.district != '')
        //         addrArr.push(info.district);
        // }
        // let addr = addrArr.join(' '),
        //     re = [];
        // if(addr != '')
            let re = await lapi.findAllPositions();
            // re = await lapi.findNearbyPositions(addr);
        console.log(re);
        console.log(typeof re);
        this.setState({
            geolocation : info,
            nearbyPositions: re.positions
        });
        //get position List
    }
    render(){
        let {geolocation, nearbyPositions} = this.state;
        // let location = JSON.stringify(geolocation)
        let addr = '';
        if(geolocation != null && geolocation != undefined)
            addr =  geolocation.nation + ',' + geolocation.province + ',' + geolocation.city + ',' +  geolocation.district + ',' + geolocation.addr;
        let positionPanelLists = [];
        if(nearbyPositions != null && nearbyPositions != undefined) {
            nearbyPositions.map((ele, idx)=>{
                let headerName = ele.name;
                const positionPanelItem = (
                    <Accordion.Panel header={headerName} key={`position_${ele._id}`}>
                        <List>
                            <InputItem
                            name="companyName"
                            placeholder=""
                            value={ele.companyName}
                            disabled>公司</InputItem>
                            <InputItem
                            name="salary"
                            placeholder=""
                            value={ele.salary}
                            disabled>薪资</InputItem>
                            <InputItem
                            name="totalRecruiters"
                            placeholder=""
                            value={ele.totalRecruiters}
                            disabled>招聘人数</InputItem>
                            <InputItem
                            name="positionDesc"
                            placeholder=""
                            value={ele.positionDesc}
                            disabled>岗位描述</InputItem>
                        </List>
                    </Accordion.Panel>
                );
                positionPanelLists.push(positionPanelItem);
            });
        }
        return(
            <div className='ant-layout'>
                <div className='ant-layout-header' style={{ padding: 0, textAlign:'center', background: '#108ee9',color: '#ffffff', fontSize:'24px'}} >附近的职位</div>
                <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'left'}}>
                        <Accordion accordion>
                            <Accordion.Panel header={addr} className="">地址：{addr}</Accordion.Panel>
                        </Accordion>
                        {/*<Accordion>
                            <Accordion.Panel header="对象" className="">api返回对象：{location}</Accordion.Panel>
                        </Accordion>*/}
                        <Accordion>
                            {positionPanelLists}
                        </Accordion>
                    </div>
                </div>
                <div className='ant-layout-footer' style={{ textAlign: 'center' }}>
                    M & G PRESENTS ©2017  (づ￣ 3￣)づ 
                </div>
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Positions args = { args } />, this);})
}