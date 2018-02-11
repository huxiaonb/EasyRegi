'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var wechatUtil = require('./server/weChat/utils/wechat.util.js');
var nodeSchedule = require('node-schedule');
app.start();

wechatUtil.getAccessToken();
// nodeSchedule.scheduleJob('*/5 * * * *', wechatUtil.getAccessToken);
nodeSchedule.scheduleJob('0 */2 * * *', wechatUtil.getAccessToken);