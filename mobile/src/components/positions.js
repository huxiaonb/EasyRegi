import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result, SearchBar} from 'antd-mobile';
import LuckyPacket from './lucky'
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Positions extends React.Component{
    state = {
        luckyFlag : true,
        noMoreP : false,
        locationFlag : false,
        geolocation : {},
        nearbyPositions : [],
        positionPanelLists : [],
        isLocationExist: false
    }
    constructAddrByLocation(info){
        let addrArr = [], addr = '';
        if(info != null && info != undefined){
            if(info.province != null && info.province != undefined && info.province != '')
                addrArr.push(info.province);
            if(info.city != null && info.city != undefined && info.city != '')
                addrArr.push(info.city);
            // if(info.district != null && info.district != undefined && info.district != '')
            //     addrArr.push(info.district);
        }
        addr = addrArr.join(',');
        return addr;
    }
    async componentWillReceiveProps(nextProps){
        let info = !!nextProps ?　nextProps.args : '';　
        if(!info || info.addr === ''){
            this.setState({
                locationFlag : true
            });
        }else if(!!nextProps){
            this.setState({
                geolocation : nextProps.args,
                isLocationExist: true
            });
            let addr = this.constructAddrByLocation(info);
            let re = {};
            if(addr != ''){
                Toast.loading('Loading...', 0);
                re = await lapi.findNearbyPositions(info);
            }
                // re = await lapi.findAllPositions();
            //alert(JSON.stringify(re));
            if(re != null && re != undefined && re.positions != null && re.positions != undefined){
                this.setState({
                    nearbyPositions: re.positions,
                });
                this.loadMore();
                Toast.hide();
            }
        }
    }
    async componentWillMount(){
        //console.log('componentWillMount')
        //alert('2');
        let info = this.props.args;
        //未成功获取位置信息
        //alert(JSON.stringify(this.props.args));
        if(!info || info.addr === ''){
            //alert('4');
            this.setState({
                locationFlag : true
            });
        }else{
            //alert('3');
            let re = {};
            let addr = this.constructAddrByLocation(info);
            if(addr != ''){
                Toast.loading('Loading...', 0);
                re = await lapi.findNearbyPositions(info);
            }

                // re = await lapi.findAllPositions();
            //alert(JSON.stringify(re));
            if(info){
                this.setState({
                    geolocation : info,
                    isLocationExist: true
                });
            }
            if(re != null && re != undefined && re.positions != null && re.positions != undefined){
                this.setState({
                    nearbyPositions: re.positions,
                    locationFlag :　false,
                });
                this.loadMore();
                Toast.hide();

            }
        }
        
        //get position List
    }
    loadMore(){
        let {nearbyPositions,luckyFlag} = this.state;
        let waitShowList = nearbyPositions.slice(0, 5);
        if(waitShowList && waitShowList.length < 5){
            this.setState({noMoreP : true})
        }

        let pArr = [...this.state.positionPanelLists];
        if(waitShowList != null && waitShowList != undefined) {
            waitShowList.map((ele, idx)=>{
                //let headerName = ele.name;
                let accHeader = (
                    <div style={{display:'flex'}}>
                        {luckyFlag ? (<LuckyPacket style={{marginRight:'.2em'}}/>) : ('')}
                        <div>
                            <span><b>{ele.city} {ele.alias} 招聘 {ele.name}</b></span>
                            <p><span>距离：{ele.distance}公里</span>  <span>招聘人数：{ele.totalRecruiters}</span></p>
                        </div>
                    </div>
                );
                const positionPanelItem = (
                    <Accordion.Panel header={accHeader} key={`position_${ele._id}`}>
                        <List>
                            <Item extra={ele.companyName}>公司</Item>
                            <Item extra={ele.totalRecruiters}>招聘人数</Item>
                            <Item extra={ele.ageRange}>年龄范围</Item>
                            <Item extra={ele.contactPerson}>联系人</Item>
                            <Item extra={ele.phoneNumber}>联系电话</Item>
                            <Item extra={ele.salary}>薪资</Item>
                            <Item>岗位描述<Brief>{ele.positionDesc}</Brief></Item>
                            <Item id='p_btn_grp' style={{marginTop:'2em'}}>
                                <Button type="primary" size="small" inline style={{marginRight:'1em'}}>立即应聘</Button>
                                <Button type="primary" size="small" inline >转发给朋友</Button>
                            </Item>
                        </List>
                    </Accordion.Panel>
                );
                pArr.push(positionPanelItem);
            });
        }
        this.setState({
            nearbyPositions : nearbyPositions.slice(5),
            positionPanelLists : pArr
        });
    }
    render(){

        let {geolocation, nearbyPositions, isLocationExist,locationFlag, waitShowList, positionPanelLists, noMoreP} = this.state;
        // let location = JSON.stringify(geolocation)
        if(locationFlag){
            return (
            <div className="result-example">
                <Result style={{height:'500px',marginTop:'30%'}}
                        img={<Icon type="exclamation-circle" className="icon" style={{ fill: '#FFC600' }} />}
                        message="未能获取到位置信息，无法显示周边招聘信息"
                    />
            </div>)
        }

        let addr = '';
        if(geolocation != null && geolocation != undefined)
            addr =  geolocation.nation + ',' + geolocation.province + ',' + geolocation.city + ',' +  geolocation.district + ',' + geolocation.addr;
        ;
        
        return(
            <div className='ant-layout'>
                <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
                    <div id='position' style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'left'}}>
                        <div className='curr-geo' style={{marginBottom:'15px'}}>
                            <span>当前位置：{addr.split(',').pop()}</span>
                            <SearchBar placeholder="Search" maxLength={8} />
                        </div>
                        
                        {/*<Accordion>
                            <Accordion.Panel header="对象" className="">api返回对象：{location}</Accordion.Panel>
                        </Accordion>*/}
                        <Accordion>
                            {positionPanelLists}
                        </Accordion>
                        {noMoreP ? <div className='curr-geo' style={{marginTop:'10px',opacity:0.5}}>
                            <span style={{}}>已列出所有附近职位</span>
                        </div> :
                        <div style={{marginTop:'10px'}}><Button type='primary' onClick={this.loadMore.bind(this)}>加载更多</Button></div>}
                    </div>
                </div>
                <div className='ant-layout-footer' style={{ textAlign: 'center',fontSize: '34px' }}>
                    Copyright ©2017 深圳云轻微创科技有限公司 粤ICP备12044479号
                </div>
            </div>
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Positions args = { args } />, this);})
}