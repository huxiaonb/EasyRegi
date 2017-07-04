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
    createOrUpdateComp(data){
        /*注册公司或更新公司数据
            var company = {
                companyName: '大贵金属附属2',
                password: '111111', //save时必须的,update时可以没有
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
    getBasicInfo(){
        //获取当前公司position计数和Applicant计数
        /*
        返回值：{ positionNumber: 3, applicantNumber: 2 }
         */
        let url = '../api/company/getBasicInfo/:companyId'; //如: ../api/company/getBasicInfo/5954ef7dc111d2bb00602cb1
        return fetch(url).then(data => data).catch(e => console.log(e));
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
    newOrupdatePosition(data){
        //创建或更新职位
        let url = '';
        return fetch(url,{
             method:"post",
             //headers:{},
             body:data
        }).then(data => data).catch(e => console.log(e));
    },
    delPosition(data){
        //删除职位
        let url = '';
        return fetch(url,{
             method:"post",
             //headers:{},
             body:data
        }).then(data => data).catch(e => console.log(e));
    },
    searchApplicant(name,dateRange=[]){
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
             body:data
        }).then(data => data).catch(e => console.log(e));
    },
    searchPostion(name,dateRange=[]){
        let url = ''+ 'name=' + '' + 'start=' + '' + 'end=' +'';
        return fetch(url).then(data => data).catch(e => console.log(e));
    }
}