require('../maintaining/models/position.model.js');
var expect = require('chai').expect,
    mongoose = require('mongoose');
var Position = mongoose.model('Position');
var request = require('request'),
    _ = require('lodash');

describe('position api unit test', function(){
    describe.skip('insert', function(){
        it('insert position by POST method', function(done){
            var position = {
                name: '软件工程师',
                totalRecruiters: 10,
                salary: '5000',
                welfares: ['五险一金'],
                positionDesc: '码代码',
                jobRequire: '会扯淡',
                phoneNumber: '13500000000'
            }
            request.post({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/position',
                body: position,
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
        it('get by name', function(done){
            var criteria = {phoneNumber: '13500000000'}; //success
            // var criteria = {name: '软件工程师'}; // report error { [Error: socket hang up] code: 'ECONNRESET' }
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/position?query=' + JSON.stringify(criteria),
                json: true
            }, function(error, response, positions){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(positions);
                    insertedId = _.get(positions, ['0', '_id'], '');
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        });

        it('get by _id', function(done){
            request.get({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/position/' + insertedId,
                json: true
            }, function(error, response, position){
                if(!error && _.get(response, ['statusCode'], 0) === 200){
                    console.log(position);
                } else {
                    console.log(error, _.get(response, ['statusCode'], 0));
                }
                done();
            });
        })

    });

    describe('load position for detail page', function(){
       it('invoke api to load position information', function(done){
           var positionId = '59ede755b29cdb2d00fe2a22';
           request.post({
               baseUrl: 'http://localhost',
               url: '/weChat/position/loadPosition',
               body: {id: positionId},
               json: true
           }, function(error, response, body){
              console.log(error, response.statusCode, JSON.stringify(body));
              done();
           });
       });
    });

});