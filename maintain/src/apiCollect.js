/*
    fetch pattern 
    fetch(url).then(response => response.json())
                .then(data => console.log(data))
                .catch(e => console.log("Oops, error", e))
*/
import fetch from 'isomorphic-fetch';
export default{
    login(data){
        //需要返回当前公司信息
        let url = '../api/company/login';
         return fetch('../api/company/login',{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        }).then((res)=>{
            if(res.status === 200){
                const token = res.headers.get('access-token');
                if (token) {
                    sessionStorage.setItem('access_token', token);
                }
            }
            return res;    
        }).catch(e => console.log(e));
    },
    logout(data){
        let url = '../api/company/logout';
        return fetch(url, {
             method:"post",
             headers:{ 'Content-Type': 'application/json',
             'Access-Token': sessionStorage.getItem('access_token') || ''
             },
             body:JSON.stringify(data)
        }).catch(e => console.log(e));
    },
    createComp(data){
        /*注册公司，email重复会返回500
        var company = {
            companyName: '高氏集团',
            password: '123456', //必须的
            alias: 'GD946',
            companyAddress: '珠海市港珠澳大湾区',
            companyType: '国企',
            companyScale: '5000人以上',
            phoneNumber: '12345678909',
            contactPersonName: '高先生',
            email: 'gd946@gd.com', 必须的
            description: '医疗，化工，金融，物流，IT，证券，银行',
            positions: []
        }
         */
        let url='../api/company/register';
        return fetch('../api/company/register',{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        }).catch(e => console.log(e));
    },
    updateComp(data){
        /*更新公司数据
            var company = {
                companyName: '大贵金属附属2',
                alias: 'DGMF',
                companyAddress: '深圳南山区南山医院附近',
                companyType: '国企',
                companyScale: '3000人以上',
                phoneNumber: '1111111',
                contactPersonName: '李先生',
                email: '3215@qq.com', //必须的
                description: '超级金属附属厂',
                positions: []
            }
        */
        let url='../api/company/update';
        return fetch('../api/company/update',{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        }).catch(e => console.log(e));
    },
    resetPassword(data){
        /**
         * var data = {
                oldPwd: '123456',
                email: 'gd946@gd.com',
                newPwd: '123'
            }
         * 
         */
        let url='../api/company/resetPassword';
        return fetch('../api/company/resetPassword',{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        }).catch(e => console.log(e));
    },
    getCompanyInfo(data){
        let url = '../api/company/getCompanyInfo';
        return fetch(url,{
             method:"post",
             headers:{ 'Content-Type': 'application/json',
             'Access-Token': sessionStorage.getItem('access_token') || ''
             },
             body:JSON.stringify(data)
        }).catch(e => console.log(e));
    },
    getBasicInfo(id){
        //获取当前公司position计数和Applicant计数
        /*
        返回值：{ positionNumber: 3, applicantNumber: 2 }
         */
        let url = '../api/company/getBasicInfo/'+ id; //如: ../api/company/getBasicInfo/5954ef7dc111d2bb00602cb1
        return fetch(url);
    },
    getApplicants(){
        //获取当前公司所有应聘者信息
        let url = '../api/company/getApplicantsByCompanyId/:companyId'; //如: ../api/company/getApplicantsByCompanyId/5954ef7dc111d2bb00602cb1
        return fetch(url).then(data => data).catch(e => console.log(e));
    },
    getPositions(){
        //获取当前公司所有职位信息
        let url = '../api/company/getPositionsByCompanyId/:companyId'; //如: ../api/company/getPositionsByCompanyId/5954ef7dc111d2bb00602cb1
        return fetch(url).then(data => data).catch(e => console.log(e));
    },
    createPosition(data){
        //创建职位
        /*
        var data = {
            companyId: '5954f059c111d2bb00602cfb', //ObjectId("5954f059c111d2bb00602cfb") 5954ef7dc111d2bb00602cb1
            position: {
                name: '人力资源',
                phoneNumber: '12345678905',
                totalRecruiters: 3,
                salary: '5000以上',
                welfares: ['五险一金', '十天年假', '年度旅游'],
                positionDesc: '主管人力资源事宜',
                jobRequire: '擅于处理公司管理事务，能适应出差'
            }
        }
         */
        let url = '../api/company/createPositionForCompany';
        return fetch(url,{
             method:"post",
             headers:{ 'Content-Type': 'application/json'
             },
             body:JSON.stringify(data)
        })
    },
    updatePosition(data){
        /*更新职位
        var data = {
            companyId: '5954f059c111d2bb00602cfb', //必须的
            position: {
                _id: '595bbb0424f4f25570896066', //必须的
                name: '人事部主管', //最好有，不然被改成空字符串，会影响search
                phoneNumber: '123123123123',
                totalRecruiters: 1,
                salary: '10000以上',
                welfares: ['五险一金', '十天年假', '年度旅游'],
                positionDesc: '主管人力资源事宜',
                jobRequire: '擅长管理行政机构，擅于处理公司管理事务，能适应出差'
            }
        }
         */
        let url = '../api/company/updatePosition';
        return fetch(url,{
             method:"post",
             headers:{ 'Content-Type': 'application/json'
             },
             body:JSON.stringify(data)
        })
    },
    delPosition(data){
        //删除职位
        let url = '../api/company/deletePositionForCompany';
        /*
        var data = {
            companyId: '5954f059c111d2bb00602cfb',
            positionId: '595bb5a09b1bf93c1c461cd0'
        }
         */
        return fetch(url,{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        });
    },
    searchApplicant(data){
        //may be url like below format
        let url = '../api/company/searchApplicants';
        /*
        var data = {
            applicantName: '李大力',
            companyId: '5954ef7dc111d2bb00602cb1', //只有这个是必须的
            startedAt: '2017-07-02',
            endedAt: '2017-07-03'
        } 

        返回值，没有就是[]，有就是applicant的数组
         */
        return fetch(url,{
             method:"post",
             //headers:{},
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        })
    },
    
    searchResumes(data){
        //may be url like below format
        let url = '../api/company/searchResumes';
        /*
        var data = {
            applicantName: '李大力',
            companyId: '5954ef7dc111d2bb00602cb1', //只有这个是必须的
            startedAt: '2017-07-02',
            endedAt: '2017-07-03'
        } 

        返回值，没有就是[]，有就是applicant的数组
         */
        return fetch(url,{
             method:"post",
             //headers:{},
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        })
    },
    
    sendResumeHasBeenCheckedMessage(data){
        //may be url like below format
        let url = '../api/applicant/sendResumeHasBeenCheckedMessage';
        /*
         var openId = !_.isEmpty(_.get(req, ['body', 'openId'], '')) ? _.get(req, ['body', 'openId'], '') : 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
        var applicantName = !_.isEmpty(_.get(req, ['body', 'applicantName'], '')) ? _.get(req, ['body', 'applicantName'], '') : '张生';
        var companyName = !_.isEmpty(_.get(req, ['body', 'companyName'], '')) ? _.get(req, ['body', 'companyName'], '') : '小米科技';

        返回值，没有就是[]，有就是applicant的数组
         */
        return fetch(url,{
             method:"post",
             //headers:{},
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        })
    },
    searchPostion(data){
        let url = '../api/company/searchPositions';
        /*
        var data = {
            positionName: '力',
            companyId: '5954f059c111d2bb00602cfb', //这个是必须的
            startAt: '2017-07-02',
            endAt: '2017-07-03'
        }
         */
        return fetch(url,{
             method:"post",
             headers:{ 'Content-Type': 'application/json'},
             body:JSON.stringify(data)
        });
    },
    getAllProvinces(){
        let url = '../api/district/getAllProvinces'
        return fetch(url);
    },
    getNextGradeDistricts(value){
        let url = '../api/district/getChildrens?' + value;
        return fetch(url);
    },
    testSendEmail(){
        //获取当前公司所有职位信息
        let url = '../account/email/send/test'; //如: ../api/company/getPositionsByCompanyId/5954ef7dc111d2bb00602cb1
        return fetch(url).then(data => data).catch(e => console.log(e));
    }
}