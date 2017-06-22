'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DictionarySchema = new Schema({
  category : {
    type: String,
    require: true
  },
  key: {
      type: String,
      require : true
  },
  value: {
      type: String,
      trim: true,
      require : true
  },
  icon : {
    type : String,
    require : false
  }
});

function dictionaryInit() {
  var Dictionary = mongoose.model('Dictionary');
  var dictTypePosition = new Dictionary({
    category : '字典类型',
    key : 'POSITION_TYPE',
    value : '职位类型'
  }),
    dictTypeWelfare = new Dictionary({
      category : '字典类型',
      key : 'WELFARE_TYPE',
      value : '福利项目'
    }),
    dictTypeCompanySegment = new Dictionary({
      category : '字典类型',
      key : 'SEGMENT_TYPE',
      value : '公司信息类型'
    });
    Dictionary.find({
      category : '字典类型',
      key : 'POSITION_TYPE',
      value : '职位类型'
    }).then(result => {
      if (result.length ==0)
        dictTypePosition.save();
    });
    Dictionary.find({
      category : '字典类型',
      key : 'WELFARE_TYPE',
      value : '福利项目'
    }).then(result => {
      if (result.length ==0)
        dictTypeWelfare.save();
    });
    Dictionary.find({
      category : '字典类型',
      key : 'SEGMENT_TYPE',
      value : '公司信息类型'
    }).then(result => {
      if (result.length ==0)
        dictTypeCompanySegment.save();
    });
}


mongoose.model('Dictionary', DictionarySchema);
dictionaryInit();
