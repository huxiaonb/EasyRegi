/**
 * Created by HUGO on 5/16/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var welfareSchema = new Schema({

});

var redPackSchema = new Schema({
   openId: String,
   redPackAmount: String
});

var PositionSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    companyId: String,
    phoneNumber: String,
    totalRecruiters: {
        type: String,
        default: ''
    },
    welfares: {
        type: Array, 
        default: []
    },
    positionDesc: {
        type: String,
        default:''
    },
    jobRequire:{
        type: String,
        default:''
    },
    isPublish: {
        type: Boolean,
        default: false
    },
    luckyFlag: String,
    redPackType :String,//红包类型 normal/rand
    redPackSum : String,//总金额
    redPackCount : String,//红包数
    redPackSendList: [redPackSchema],
    beginDate : Date,//有效期起
    endDate: Date,//有效期止
    salaryType : String,
    salaryStart: String,
    salaryEnd: String,
    contactPerson: String,
    ageRangeStart: String,
    ageRangeEnd: String
},{
    collection: 'positions',
    timestamps: true
});

mongoose.model('Position', PositionSchema);
