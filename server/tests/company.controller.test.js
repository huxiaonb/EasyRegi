let _ = require('lodash'),
    mongoose = require('mongoose'),
    request = require('request');

describe('company', function(){
    describe('company api', function(){
        this.timeout(10000);
        it('login', function(done){
            var query = {
                account: 'wps@wps.com',
                pwd: ''
            };
            request.post({
                url: 'http://maaaace.nat200.top/api/company/login',
                body: query,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            });
        });

        it.skip('save', function(done){
            var company = {
                companyName: '大贵金属',
                password: '12345',
                alias: 'DGM',
                companyAddress: '深圳南山区',
                companyType: '国企',
                companyScale: '5000人以上',
                phoneNumber: '123232',
                contactPersonName: '赵先生',
                email: '3215@qq.com',
                description: '超级金属',
                positions: []
            }
            request.post({
                url: 'http://localhost:3000/api/company/update',
                body: company,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('update', function(done){
            var company = {
                companyName: '大贵金属附属2',
                password: '111111',
                alias: 'DGMF',
                companyAddress: '深圳南山区南山医院附近',
                companyType: '国企',
                companyScale: '3000人以上',
                phoneNumber: '1111111',
                contactPersonName: '李先生',
                email: '3215@qq.com',
                description: '超级金属附属厂',
                positions: []
            }
            request.post({
                url: 'http://localhost:3000/api/company/update',
                body: company,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('getBasicInfo', function(done){
            request.get({
                url: 'http://localhost:3000/api/company/getBasicInfo/5954ef7dc111d2bb00602cb1',
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('getApplicantsByCompanyId', function(done){
            request.get({
                url: 'http://localhost:3000/api/company/getApplicantsByCompanyId/5954ef7dc111d2bb00602cb1',
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('getApplicantsByCompanyId', function(done){
            request.get({
                url: 'http://localhost:3000/api/company/getPositionsByCompanyId/5954ef7dc111d2bb00602cb1',
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('searchApplicants', function(done){
            var data = {
                applicantName: '力',
                companyId: '5954ef7dc111d2bb00602cb1',
                startedAt: '2017-07-02',
                endedAt: '2017-07-03'
            }
            request.post({
                url: 'http://localhost:3000/api/company/searchApplicants',
                body: data,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('get company info without login', function(done){
            request.post({
                url: 'http://maaaace.nat200.top/api/company/getCompanyInfo',
                body: {},
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company info successfully');
                    console.log(body);
                    
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            });
        });

        it('login & get company info', function(done){
            var query = {
                account: 'wps@wps.com',
                pwd: '123'
            };
            request.post({
                url: 'http://maaaace.nat200.top/api/company/login',
                body: query,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                    request.post({
                        url: 'http://maaaace.nat200.top/api/company/getCompanyInfo',
                        body: {},
                        json: true
                    }, function(error, response, body){
                        if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                            console.log('get company info successfully');
                            console.log(body);
                            
                        } else {
                            console.log(body);
                            var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                            console.log(JSON.stringify(errmsg));
                        }
                        done();
                    });
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                    done();
                }
            });
        });

        it('create position', function(done){
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
            request.post({
                url: 'http://localhost:3000/api/company/createPositionForCompany',
                body: data,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('searchPositions', function(done){
            var data = {
                positionName: '力',
                companyId: '5954f059c111d2bb00602cfb', //ObjectId("5954f059c111d2bb00602cfb")
                startedAt: '2017-07-02',
                endedAt: '2017-07-03'
            }
            request.post({
                url: 'http://localhost:3000/api/company/searchPositions',
                body: data,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });

        it('deletePositions', function(done){
            var data = {
                companyId: '5954f059c111d2bb00602cfb',
                positionId: '595bb5a09b1bf93c1c461cd0'
            }
            request.post({
                url: 'http://localhost:3000/api/company/deletePositionForCompany',
                body: data,
                json: true
            }, function(error, response, body){
                if(!error && response.statusCode == 200 && !_.isEmpty(body)) {
                    console.log('get company login info successfully');
                    console.log(body);
                } else {
                    console.log(body);
                    var errmsg = {errmsg: _.get(body, ['errmsg'], ''), error: error, statusCode: response.statusCode};
                    console.log(JSON.stringify(errmsg));
                }
                done();
            })
        });
    });
});