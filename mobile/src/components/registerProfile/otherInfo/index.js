import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'antd/lib/button'
import PropTypes from 'prop-types';

import message from 'antd/lib/message'

import 'antd/lib/button/style/index.less';
import 'antd/lib/message/style/index.less';

import WorkExp from './work';
import EduExp from './education'

export default class OhterInfo extends React.Component {
    static contextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }
    
    prevStep(){
        this.saveForTempory(0);
        this.props.prev();
    }
    sumitAll(){
        this.saveForTempory(0);
        if(this.context.profile.otherInfo.workExps.length && this.context.profile.otherInfo.edus.length){
            this.props.handleSubmit();
        }  
    }
    saveForTempory(pFlag = 1){
        let wFlag, eFlag = false;
        let { workF, eduF } = this.refs;
        let workFs,eduFs = [];
        workF.validateFieldsAndScroll(async (err, values)=>{
             if (!!err) return
             //set value to context 
             //rangetime set config
             wFlag = true;
             let keys = workF.fieldsStore.getFieldValue('keys')
             workFs = [Object.assign({},{
                 companyName : workF.fieldsStore.getFieldValue('title'),
                 date : workF.fieldsStore.getFieldValue('rangeTime'),
                 title : workF.fieldsStore.getFieldValue('position'),
                 salaryRange : workF.fieldsStore.getFieldValue('salary'),
             })];
             
             keys.map((key, index) => {
                 let fmObj = Object.assign({},{
                    companyName : workF.fieldsStore.getFieldValue('title_' + key),
                    date : workF.fieldsStore.getFieldValue('rangeTime_' + key),
                    title : workF.fieldsStore.getFieldValue('position_' + key),
                    salaryRange : workF.fieldsStore.getFieldValue('salary_' + key),
                 });
                 workFs.push(fmObj);
             })
        });
        eduF.validateFieldsAndScroll(async (err, values)=>{
             if (!!err) return
             //set value to context
             //rangetime set config
             eFlag = true
             let keys = eduF.fieldsStore.getFieldValue('keys');
             eduFs = [Object.assign({},{
                 colledgeName : eduF.fieldsStore.getFieldValue('title'),
                 date : eduF.fieldsStore.getFieldValue('rangeTime'),
                 major : eduF.fieldsStore.getFieldValue('position'),
                 isGraduated : eduF.fieldsStore.getFieldValue('grad'),
             })];
             
             keys.map((key, index) => {
                 let fmObj = Object.assign({},{
                    colledgeName : eduF.fieldsStore.getFieldValue('title_'+ key),
                    date : eduF.fieldsStore.getFieldValue('rangeTime_'+ key),
                    major : eduF.fieldsStore.getFieldValue('position_'+ key),
                    isGraduated : eduF.fieldsStore.getFieldValue('grad_'+ key),
                 });
                 eduFs.push(fmObj);
             })
        });
        if(wFlag && eFlag){
            this.context.updateProfile({otherInfo:{workExps:workFs,wkeys:workF.fieldsStore.getFieldValue('keys'),edus:eduFs,ekeys:eduF.fieldsStore.getFieldValue('keys')},flag:3});
            if(!!pFlag)message.success('暂存成功!');
        }
    }
    /*componentDidMount(){
        let {workExps,edus} = this.context.profile.otherInfo;
        let { workF, eduF } = this.refs;
        if(workExps.length){
            workExps.map((wk,idx)=>{
                if(idx){
                    workF.setFieldsValue({
                        ['companyName_' + idx] : wk.companyName,
                        ['date_' + idx] : wk.date,
                        ['title_' + idx] : wk.title,
                        ['salaryRange_' + idx] : wk.salaryRange
                    })  
                }else{
                    workF.setFieldsValue({
                        companyName : wk.companyName,
                        date : wk.date,
                        title : wk.title,
                        salaryRange : wk.salaryRange
                    })
                }
            });
        }
        if(edus.length){
            edus.map((wk,idx)=>{
            if(idx){
                eduF.setFieldsValue({
                    ['colledgeName_' + idx] : wk.colledgeName,
                    ['date_' + idx] : wk.date,
                    ['major_' + idx] : wk.majors,
                    ['isGraduated_' + idx] : wk.isGraduated
                })  
            }else{
                eduF.setFieldsValue({
                    colledgeName : wk.colledgeName,
                    date : wk.date,
                    major : wk.major,
                    isGraduated : wk.isGraduated
                })
            }
            })
        }
        
        
    }*/
    render(){
        let { workExps,edus,wkeys,ekeys } = this.context.profile.otherInfo;
        console.log(ekeys,wkeys);
        return (
            <div key='exp_cntr'>
                <WorkExp workExps={workExps} wkeys={wkeys} ref='workF' />
                <EduExp edus={edus} ekeys={ekeys} ref='eduF' />
                <div style={{textAlign:'center', marginTop:'15px'}}>
                    <Button style={{ marginRight: 8 }} onClick={this.prevStep.bind(this)}>上一步</Button>
                    
                    <Button type="primary" onClick={this.sumitAll.bind(this)}>确认提交</Button>
                </div>
            </div>
        )
    }
}