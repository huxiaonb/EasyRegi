let _ = require('lodash'),
    mongoose = require('mongoose'),
    request = require('request');

describe('company', function(){
    describe('company api', function(){
        this.timeout(10000);
        it('login', function(done){
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
                } else {
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
                applicantName: '李大力',
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
    });
});