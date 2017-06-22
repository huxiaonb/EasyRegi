/**
 * Created by FUMA2 on 6/20/2016.
 */

require('../maintaining/models/position.model.js')
var expect = require('chai').expect,
    mongoose = require('mongoose'),
    Position = mongoose.model('Position'),
    request = require('request');
    util = require('util');


describe('test position model',function(){
    describe('#save()', function(){
        this.timeout(4000);
        before(function(done){
            var datas = [{
              name: '软件工程师',
              money: '8K-10K',
              description: 'Java',
              experience: '应届毕业生',
              certificate: '本科',
              jobType: 'TECH'
            },{
              name: '技术支持',
              money: '8K-10K',
              description: 'Java',
              experience: '应届毕业生',
              certificate: '本科',
              jobType: 'SUPPORT'
            },{
              name: '测试工程师',
              money: '8K-10K',
              description: 'Java',
              experience: '应届毕业生',
              certificate: '本科',
              jobType: ''
            },{
              name: '客服',
              money: '8K-10K',
              description: 'Java',
              experience: '应届毕业生',
              certificate: '本科',
              jobType: 'SERVICE'
            }];
            var position = new Position({
                name: '软件工程师',
                money: '8K-10K',
                description: 'Java',
                experience: '应届毕业生',
                certificate: '本科',
                jobType: 'TECH'
            });
            /*position.save(function(err){
                console.log(err);
                if(!err) done();
            });*/
            request.post({
                baseUrl: 'http://localhost:3000',
                url: '/api/v1/position',
                body: datas,
                json: true
            }, function(error, response, body) {
                if (error) console.log(error);
                console.log(body);
                return done();
            });

        });

        it('A case for query by restify-mongoose', function(done){
            var query = {'name':'Software developer'};
            request.get({
                baseUrl: 'http://localhost:3000',
                url: util.format('/api/v1/position?query=%s', encodeURIComponent(JSON.stringify(query))),
                json: true
            },function(error, response, positions){
                console.log(positions);
                done();
            });
        });
    });
});
