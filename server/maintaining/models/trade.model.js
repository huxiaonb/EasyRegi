/**
 * Created by HUGO on 5/16/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var TradeSchema = new Schema({
    bid :  String,
    total_fee : Number,
    result : String,
    startDate : Date,
    wechatId : String,
    time_end : String,
    total_fee_from_client : Number,
},{
    collection: 'trade',
    timestamps: true
});

mongoose.model('Trade', TradeSchema);
