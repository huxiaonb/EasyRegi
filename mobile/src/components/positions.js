import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {wepay} from './utils'
import {Flex, Accordion, List, InputItem, Button, Icon, TextareaItem, Toast, Result} from 'antd-mobile';

import LuckyPacket from './lucky'
import lapi from './registerProfile/lapi'
import './less/index.less'

const Item = List.Item;
const Brief = Item.Brief;

class Positions extends React.Component{
    state = {
        noMoreP : false,
        locationFlag : false,
        geolocation : {},
        nearbyPositions : [],
        positionPanelLists : [],
        isLocationExist: false,
        limit : 5,
        offset : 5,
        slimit : 5,
        soffset : 5,
        kw : '',
        currentPosition: {}
    }
    async onSearch(kw){
        console.log(kw);
        if(kw===''){
            this.load();
        }else{
            let info = this.state.geolocation;
            let r = await lapi.searchPositions(info, 5, 0, kw);
            if (r.success) {
                this.setState({
                    kw,
                    nearbyPositions: r.position
                })
            } else {
                console.log(r);
            }
        }
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
        let {limit, offset}  = this.state;
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
    async load(){
        //console.log('componentWillMount')
        //alert('2');
        let info = this.props.args.position;
        //未成功获取位置信息
        //alert(JSON.stringify(this.props.args));
        if (!info || info.addr === '') {
            //alert('4');
            this.setState({
                locationFlag: true
            });
        } else {
            //alert('3');
            let re = {};
            let addr = this.constructAddrByLocation(info);
            if (addr != '') {
                Toast.loading('Loading...', 0);
                re = await lapi.findNearbyPositions(info);
            }

            // re = await lapi.findAllPositions();
            //alert(JSON.stringify(re));
            if (info) {
                this.setState({
                    geolocation: info,
                    isLocationExist: true
                });
            }
            if (re != null && re != undefined && re.positions != null && re.positions != undefined) {
                this.setState({
                    nearbyPositions: re.positions,
                    noMoreP: !re.existFlag,
                    locationFlag: 　false,
                });
                Toast.hide();

            }
        }
    }
    componentWillMount(){
        this.props;
        this.initWechatJsSdk();
        this.load();
        //get position List
    }
    filterSameItems(newA=[],old=[]){
        old.map(o=>{
            newA = newA.filter(a=>(a._id !== o._id));
        })
        return newA;
    }
    async loadMore(){
        let { nearbyPositions,  geolocation, limit, offset, slimit, soffset, noMoreP, kw } = this.state;
        if (noMoreP) return;
        let r = kw.length ? await lapi.searchPositions(geolocation, slimit, soffset, kw) : await lapi.findNearbyPositions(geolocation, limit, offset);
        
        if (r && r.success) {
            this.setState({
                nearbyPositions: [...nearbyPositions, ...r.positions],
                noMoreP: !r.existFlag,
                offset: r.existFlag ? offset + 5 : offset,
            })
        }
    }
    async apply(id){
        var completeFlag = this.props.args.isComplete === 'true' ? true: false;
        if (completeFlag){
            let r = await wepay({ openId: this.props.args.openId, selectCompanyId: id })
            if (r){
                this.setState({
                    sflag : true,
                    stitle : '提交成功'
                })
            }else{
                Toast.error('error');
                Toast.hide();
            }
        }else{
            Toast.info('请完善个人简历！');
        }
    }
    onPositionChange = (key) => {
        if(key !== undefined) {
            console.log(key);
            let nearbyPositions = this.state.nearbyPositions;
            var keyArray = key.split('_');
            var title = '入职易--我刚找到了一份好工作，你也来试试',
                link = '',
                imgUrl = 'http://www.mfca.com.cn/img/dog.jpg';
            if(keyArray.length > 1 && keyArray[1] !== undefined){
                let currentPosition = nearbyPositions.filter((pos) => {return pos._id === keyArray[1];});
                console.log(currentPosition[0]);
                if(currentPosition.length > 0)
                    this.setState({currentPosition: currentPosition[0]});
                link = 'http://www.mfca.com.cn/details/' + keyArray[1];
            } else {
                link = 'http://www.mfca.com.cn/positions';
            }
            console.log(title, link, imgUrl);

            this.shareToTimeLine(title, link, imgUrl);
        }
    }

    initWechatJsSdk = () => {
        let self = this;
        let {signatureObj, wx} = this.props.args;
        wx.config({
            debug: false,
            appId: 'wx54e94ab2ab199342',
            timestamp: signatureObj.timestamp,//Date.now().toString().substr(0,10),
            nonceStr: signatureObj.noncestr,//generateNonceString(),
            signature: signatureObj.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow'
            ]
        });

        wx.ready(function(){
            var title = '入职易--我刚找到了一份好工作，你也来试试',
                link = 'http://www.mfca.com.cn',
                imgUrl = 'http://www.mfca.com.cn/img/dog.jpg';
            self.shareToTimeLine(title, link, imgUrl);
        });
    }

    shareToTimeLine = (title, link, imgUrl) =>{
        let self = this;
        let currentPosition = this.state.currentPosition;
        let wx = this.props.args.wx;
        wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: imgUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                var currentPosition1 = self.state.currentPosition;
                if(currentPosition1.luckyFlag){
                    Toast.info('分享到朋友圈成功');
                    self.sendRedPack();
                } else {
                    Toast.info('该职位不是红包职位');
                }
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                Toast.info('你没有分享到朋友圈');
            }
        });
    }
    async sendRedPack(){
        let currentPosition = this.state.currentPosition;
        let r = await lapi.sendRedPack(currentPosition._id);
        if(r && r.success){
            Toast.info('发送红包成功');
        } else {
            Toast.error('发送红包失败');
            Toast.hide();
        }
    }
    showTipsForSharingToTimeLine = () => {
        $("#shareit").show('normal', function(){
            // console.log('shown');
        });
    }

    render(){
        let { geolocation, nearbyPositions, isLocationExist, locationFlag, noMoreP, sflag} = this.state;
            nearbyPositions = nearbyPositions.sort((m,n)=>(m.distance>n,distance));
        
            const list = nearbyPositions && nearbyPositions.length ? nearbyPositions.map((ele, idx) => {
                return (
                        <Accordion.Panel header={
                            <div style={{ display: 'flex' }}>
                            {ele.luckyFlag ? (<LuckyPacket style={{ marginRight: '.2em',marginTop : '.3em'}} />) : ('')}
                                <div>
                                    <span><b>{ele.city} {ele.alias} 招聘 {ele.name}</b></span>
                                    <p><span>距离：{ele.distance}公里</span>  <span>招聘人数：{ele.totalRecruiters}</span></p>
                                </div>
                            </div>
                        } 
                         key={`position_${ele._id}_${ele.name}`}
                         >
                            <List>
                                <Item extra={ele.companyName}>公司</Item>
                                <Item extra={ele.totalRecruiters}>招聘人数</Item>
                                <Item extra={ele.ageRange}>年龄范围</Item>
                                <Item extra={ele.contactPerson}>联系人</Item>
                                <Item extra={ele.phoneNumber}>联系电话</Item>
                                <Item extra={ele.salary}>薪资</Item>
                                <Item>岗位描述<Brief>{ele.positionDesc}</Brief></Item>
                                <Item id='p_btn_grp' style={{ marginTop: '2em' }}>
                                    <Button type="primary" size="small" inline onClick={this.apply.bind(this,ele.companyId)}style={{ marginRight: '1em' }}>立即应聘</Button>
                                    <Button type="primary" size="small" inline onClick={this.showTipsForSharingToTimeLine.bind()}>转发给朋友</Button>
                                </Item>
                            </List>
                        </Accordion.Panel>
                );
            }) : null;
        
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
        if (sflag) {
            return(
                <div className="result-example">
                    <Result style={{ height: '500px', marginTop: '30%' }}
                        img={<Icon type="check-circle" className="icon" style={{ fill: '#1F90E6' }} />}
                        title='操作成功'
                        message="简历已提交"
                    />
                    <Button type='primary' style={{ width: 'auto' }} onClick={this.bindTimelineData.bind(this)}>转发到朋友圈</Button>
                </div>
            );
        }
        return(
            <div className='ant-layout'>
                <div className='ant-layout-content' style={{ margin: '24px 16px 0' }}>
                    <div id='position' style={{ padding: 24, background: '#fff', minHeight: 360 ,textAlign:'left'}}>
                        <div className='curr-geo' style={{marginBottom:'15px'}}>
                            <span>当前位置：{addr.split(',').pop()}</span>
                            <InputItem  placeholder='在这里搜索' maxLength={40} onChange={this.onSearch.bind(this)}/>
                        </div>


                        <Accordion accordion onChange={this.onPositionChange}>
                            {list}
                        </Accordion>
                        {noMoreP ? <div className='curr-geo' style={{marginTop:'10px',opacity:0.5}}>
                            <span style={{}}>已列出所有附近职位</span>
                        </div> :
                        <div style={{marginTop:'10px'}}><Button type='primary' style={{width : 'auto'}} onClick={this.loadMore.bind(this)}>加载更多</Button></div>}
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