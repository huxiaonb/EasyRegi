'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  _id: {
    type: String
  },
  session: {
    type: String
  },
  expires: {
    type: Date
  }
});
    
mongoose.model('Session', SessionSchema);