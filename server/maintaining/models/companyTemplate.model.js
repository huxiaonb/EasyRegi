/**
 * Created by HUGO on 5/16/2016.
 */


'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CompanyTemplateSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  type:{
    type: String
  }
});

mongoose.model('CompanyTemplate', CompanyTemplateSchema);
