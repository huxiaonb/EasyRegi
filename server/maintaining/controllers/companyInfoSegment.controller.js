'use strict';

var mongoose = require('mongoose');
var CompanyInfoSegment = mongoose.model('CompanyInfoSegment');

module.exports.changeCompanySegmentLayout = function (req, res) {
  var segmentType = req.query.segmentType;
  var isFlow = req.body.isFlow;
  CompanyInfoSegment.update({'type' : segmentType},{$set: { 'isFlow': isFlow }},{multi: true},function(err, result){
    if(err){
      return res.status(400).json(err);
    }else{
      return res.status(200).json(result);
    }
  });
};