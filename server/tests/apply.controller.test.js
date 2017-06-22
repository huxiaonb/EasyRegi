/**
 * Created by fuma2 on 7/1/2016.
 */
var expect = require('chai').expect,
    appContoller = require('../position/controllers/position.controller.js');
var mongoose = require('mongoose');
var Position = mongoose.model('Position');
var Dictionary = mongoose.model('Dictionary');
var Applicant = mongoose.model('Applicant');

describe('apply controller',function(){
    describe('#apply()', function(){
        it('apply',function(){
            /*console.log('in test funciton');
            appContoller.apply(req, res);*/
        });
    });
});
