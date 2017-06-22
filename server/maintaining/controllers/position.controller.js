'use strict';

var request = require('superagent');
var mongoose = require('mongoose');
var positionSchema = mongoose.model('Position');

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";

module.exports.publish = function (req, res) {
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.update({_id : p._id}, {$set:{status:ACTIVE}})
            .exec(function(err,result) {
                res.end();
            });
    });
};


module.exports.stopPublish = function (req, res) {
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.update({_id : p._id}, {$set:{status:INACTIVE}})
            .exec(function(err,result) {
                res.end();
            });
    });
};


module.exports.preview = function (req, res) {
    positionSchema.find({status: 'ACTIVE'}).then(function (result) {
        res.render('./server/position/views/position', {
            positions: result
        });
    });
};

module.exports.deletePosition = function(req, res){
    var positions = req.body;
    if(positions.length === 0){
        return res.end();
    }
    positions.forEach(function(p){
        positionSchema.remove({_id : p._id})
            .exec(function(err,result) {
                res.end();
            });
    });
};


