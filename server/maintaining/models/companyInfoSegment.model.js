/**
 * Created by HUGO on 5/16/2016.
 */


'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CompanyInfoSegmentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  subTitle: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String
  },
  type:{
    type: String
  },
  sequence :{
    type: Number
  },
  isFlow : {
    type : Boolean,
    default : true
  }
});

mongoose.model('CompanyInfoSegment', CompanyInfoSegmentSchema);
