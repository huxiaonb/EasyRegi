/*
    fetch pattern 
    fetch(url).then(response => response.json())
                .then(data => console.log(data))
                .catch(e => console.log("Oops, error", e))
*/
export default{
    login(acc,pwd){
        //需要返回当前公司信息
        let url = '';
        return fetch(url,{
             method:"post",
             //headers:{},
             body:{account : acc, pwd :pwd}
        }).then(data => data).catch(e => console.log(e));
    },
    createOrUpdateComp(data){
        /*注册公司或更新公司数据
            data{
                name：全名
                alias：简称
                prop：类型
                size：规模，
                contact_person:联系人,
                contact_phone:联系电话,
                email:邮箱 用作 登录 id,
                addr: 公司地址,
                desc：简介
            }
        */
        let url='';
        return fetch(url,{
             method:"post",
             //headers:{},
             body:data
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