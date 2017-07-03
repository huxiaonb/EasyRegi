/*
    fetch pattern 
    fetch(url).then(response => response.json())
                .then(data => console.log(data))
                .catch(e => console.log("Oops, error", e))
*/
import fetch from 'isomorphic-fetch';
export default{
    login(acc,pwd){
        //需要返回当前公司信息
        let url = '../api/company/login';
        return fetch(url,{
             method:"post",
             //headers:{},
             body:{account : acc, pwd :pwd}
        }).then(data => data).catch(e => console.log(e));
    },
    createOrUpdateComp(data){
        /*注册公司或更新公司数据
            var company = {
                companyName: '大贵金属附属2',
                password: '111111', //必须的
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
        return fetch(url,{
             method:"post",
             //headers:{},
             body:company
        }).then(data => data).catch(e => console.log(e));
    },
    getBasicInfo(){
        //获取当前公司position计数和Applicant计数
        let url = '';
        return fetch(url).then(data => data).catch(e => console.log(e));
    },
    getApplicants(){
        //获取当前公司所有应聘者信息
        let url = '';
        return fetch(url).then(data => data).catch(e => console.log(e));
    },
    getPositions(){
        //获取当前公司所有职位信息
        let url = '';
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
        let url = ''+ 'name=' + '' + 'start=' + '' + 'end=' +'';
        return fetch(url).then(data => data).catch(e => console.log(e));
    },
    searchPostion(name,dateRange=[]){
        let url = ''+ 'name=' + '' + 'start=' + '' + 'end=' +'';
        return fetch(url).then(data => data).catch(e => console.log(e));
    }
}