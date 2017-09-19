var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');

var District = mongoose.model('District');

exports.getAllProvinces = getAllProvinces;
exports.getChildrens = getChildrens;

function getAllProvinces(req, res, next){
    // res.json({provinces: [{label:'北京市'}]});
    District.find({locationType: 'province', active: true}).sort({'acronym':1}).exec(function(err, dbProvinces){
        if(err) {
            logger.info('Error in getting provinces', err);
            res.status(500).send({success: false, errmsg: 'error in getting all provinces', provinces: []});
        } else {
            var provinceDtos = [];
            _.forEach(dbProvinces, function(item){
                var dto = {
                    label: _.get(item, ['label'], ''),
                    value: _.get(item, ['acronym'])
                };
                provinceDtos.push(dto);
            });
            res.json({success: true, errmsg: '', provinces: provinceDtos})
        }
    });
}

function getChildrens(req, res, next){
    var label = _.get(req, ['query', 'label'], ''),
        parentLabel = _.get(req, ['query', 'parentLabel']);
    logger.info(label, parentLabel);
    if(_.isEmpty(label)){
        res.status(500).send({success: false, errmsg: 'label and type are required', childrens: []});
    } else {
        if(_.isEmpty(parentLabel)){
            getChildrenByParent(label, 'province', function(err, dbItems){
                if(err) {
                    logger.info('error in getting childrens by label %s and type %s', label, type, err);
                    res.status(500).send({success: false, errmsg: 'label and type are required', childrens: []});
                } else {
                    var childrens = [];
                    if(!_.isEmpty(dbItems)){
                        _.forEach(dbItems, function(item){
                            var dto = {
                                label: _.get(item, ['label'], ''),
                                value: _.get(item, ['acronym'])
                            };
                            childrens.push(dto);
                        });
                    }
                    res.json({success: true, errmsg: '', childrens: childrens});
                }
            });

        } else {
            getChildrenByParent(parentLabel, 'province', function(err, dbItems){
                if(err) {
                    logger.info('error in getting childrens by label %s and type province', parentLabel, err);
                    res.status(500).send({success: false, errmsg: 'label and type are required', childrens: []});
                } else {
                    var childrens = [];
                    var item = _.find(dbItems, {label: label});
                    logger.info(item);
                    var id = _.get(item, ['_id'], '');
                    if(_.isEmpty(id)){
                        res.json({success: true, errmsg: '', childrens: childrens});
                    } else {
                        getChildrenByParentId(id, function(err1, dbChildrens){
                            if(err1) {
                                logger.info('error in finding childrens by parent id', id, err1);
                                res.status(500).send({success: false, errmsg: 'error in finding childrens', childrens: []});
                            } else {
                                if(!_.isEmpty(dbChildrens)){
                                    _.forEach(dbChildrens, function(child){
                                        var dto = {
                                            label: _.get(child, ['label'], ''),
                                            value: _.get(child, ['acronym'])
                                        };
                                        childrens.push(dto);
                                    });
                                }
                                res.json({success: true, errmsg: '', childrens: childrens});
                            }
                        });
                    }
                }
            });
        }

    }
    
}

function getChildrenByParent(label, type, callback) {
    District.findOne({label: label, locationType: type}, function(err, parent){
        if(err) {
            return callback(err, null);
        } else {
            if(_.isEmpty(parent)){
                logger.info('no parent found by label %s and type %s', label, type);
                return callback(null, null);
            } else {
                var id = _.get(parent, ['_id'], '');
                getChildrenByParentId(id, function(err1, dbItems){
                    if(err1) {
                        logger.info('error in finding childrens by parent id', id, err1);
                        return callback(err1, null);
                    } else {
                        return callback(null, dbItems);
                    }
                });
            }
        }
    });
}

function getChildrenByParentId(id, callback){
    District.find({parentId: id}, function(err1, dbItems){
        if(err1) {
            return callback(err1, null);
        } else {
            return callback(null, dbItems);
        }
    });
}
