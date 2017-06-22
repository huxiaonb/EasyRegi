require('../maintaining/models/companyInfo.model.js');
var expect = require('chai').expect,
    mongoose = require('mongoose');
var Company = mongoose.model('Company');
var request = require('request'),
    _ = require('lodash');

describe('company api unit test', function(){
    describe('insert', function(){
        it('insert company by POST method', function(done){
            var company = {
                loginId: 'oocluser',
                password: '123456',
                companyName: 'OOCL ZHA',
                alias: 'OOCL',
                companyType: '外资',
                companyScale: '5000 以上',
                phoneNumber: '13500000000'
            }
            request.post({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/company',
                body: company,
                json: true
            }, function(error, response, result){
                if(!error && _.get(response, ['statusCode'], 0) === 201){
                    console.log(result);
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        });

        var insertedId = '';
        it('get by loginId', function(done){
            var criteria = {loginId: 'oocluser'};
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/company?query=' + JSON.stringify(criteria),
                json: true
            }, function(error, response, companies){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(companies);
                    insertedId = _.get(companies, ['0', '_id'], '');
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        });

        it('get by _id', function(done){
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/company/' + insertedId,
                json: true
            }, function(error, response, company){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(company);
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        })

    })

});