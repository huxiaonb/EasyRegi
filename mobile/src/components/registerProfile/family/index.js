import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import {Button, Toast, Card, Badge} from 'antd-mobile';
import FamilyInfo from './family';
import ThreeCategory from './three';
import EmergencyContact from './emergency';
let familyInt, threeCategoryInt, emergencyInt = null;
export default class Family extends React.Component {
    static contextTypes = {
        profile: PropTypes.object,
        updateProfile: PropTypes.func
    }
    
    saveForTempory(pFlag = 1){
 
        let wFlag, eFlag = false;
        let family = familyInt.props.form;
        let threeCategory = threeCategoryInt.props.form;
        let emergency = emergencyInt.props.form;
        let familys=[],threeCategorys = [];
        let emInt = null;
        family.validateFields(async (err, values)=>{
             if (!!err){
                 return;
             }else{
                  wFlag = true;
                    let keys = family.getFieldValue('keys')
                    familys = [Object.assign({},{
                        name : family.getFieldValue('name'),
                        relationship : family.getFieldValue('relationship'),
                        phoneNumber : family.getFieldValue('mphoneNumber'),
                        homeAddress : family.getFieldValue('homeAddress'),
                        emergencyFlag : family.getFieldValue('em_check')
                    })];
                    
                    keys.map((key, index) => {
                        let fmObj =Object.assign({},{
                            name : family.getFieldValue('name_'+ key),
                            relationship : family.getFieldValue('relationship_' + key),
                            phoneNumber : family.getFieldValue('mphoneNumber_' + key),
                            homeAddress : family.getFieldValue('homeAddress_' + key),
                            emergencyFlag : family.getFieldValue('em_check_' + key)
                        })
                        familys.push(fmObj);
                    })
                }
             //set value to context 
             //rangetime set config
            
        });
        threeCategory.validateFields(async (err, values)=>{
             if (!!err) return
             //set value to context
             //rangetime set config
             eFlag = true
             let keys = threeCategory.getFieldValue('keys');
             
             keys.map((key, index) => {
                 let fmObj = Object.assign({},{
                    name : threeCategory.getFieldValue('name_' + key),
                    department : threeCategory.getFieldValue('department_' + key),
                    type : threeCategory.getFieldValue('type_' + key),
                    relationship : threeCategory.getFieldValue('relationship_' + key),
                    employeeNumber: threeCategory.getFieldValue('employeeNumber_' + key)
                });
                 threeCategorys.push(fmObj);
             })
        });
        emergency.validateFields(async (err, values)=>{
            if (!!err) return
            emInt = Object.assign({},{
                        emergencyContactName : emergency.getFieldValue('name'),
                        emergencycontactrelation : emergency.getFieldValue('relationship'),
                        emergencyContactPhoneNumber : emergency.getFieldValue('mobile'),
                        emergencyContactAddress : emergency.getFieldValue('homeAddress')
                    })
        })
        if(wFlag && eFlag){
            this.context.updateProfile({emergency : emInt, family:{family:familys,fkeys:family.getFieldValue('keys'),threeCategory:threeCategorys,tkeys:threeCategory.getFieldValue('keys')},flag:2});
            //if(!!pFlag)Toast.success('暂存成功!',1);
            return true;
        }else{return false;}
    }
    prevStep(){
        this.saveForTempory();
        this.props.prev();
    }

    nextStep(){
         if(this.saveForTempory()){
            this.props.next();
        }
    }

    render(){
        return(
            <div>
                <FamilyInfo family={this.props.family} wrappedComponentRef={(inst) => familyInt = inst} />
                <div className='emergency-div'>
                    <EmergencyContact emergency={this.props.emergency} wrappedComponentRef={(inst) => emergencyInt = inst}/>
                </div>
                <ThreeCategory tc={this.props.tc} wrappedComponentRef={(inst) => threeCategoryInt = inst} />
                <div style={{textAlign:'center', marginTop:'15px'}}>
                    <Button style={{ marginRight: 8 }} onClick={this.prevStep.bind(this)}>上一步</Button>
                    <Button type="primary" style={{marginTop:'15px'}} onClick={this.nextStep.bind(this)}>下一步</Button>
                </div>
            </div>
        );
    }
}