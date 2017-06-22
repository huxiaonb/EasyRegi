require('../maintaining/models/applicant.model.js');
var expect = require('chai').expect,
    mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');
var request = require('request'),
    _ = require('lodash');

describe('applicant api unit test', function(){
    describe('insert', function(){
        it('insert applicant by POST method', function(done){
            var applicant = {
                wechatOpenId: '1234567',
                name: 'mace',
                gender: 'male',
                emergencyContactPerson: {
                    name: 'mace1',
                    relationship: 'brother',
                    phoneNumber: '1234567890',
                    homeAddress: '广东省珠海市香洲区'
                }
            }
            request.post({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/applicant',
                body: applicant,
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
        it('get by wechatOpenId', function(done){
            var criteria = {wechatOpenId: '1234567'};
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/applicant?query=' + JSON.stringify(criteria),
                json: true
            }, function(error, response, applicants){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(applicants);
                    insertedId = _.get(applicants, ['0', '_id'], '')
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        });

        it('get by _id', function(done){
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/applicant/' + insertedId,
                json: true
            }, function(error, response, applicants){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(applicants);
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        })

    })

});