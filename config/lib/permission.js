'use strict';

var permissionConfig = require("../permissionConfig/roleConfig").roleConfig;
var redirectConfig = require("../permissionConfig/redirectConfig").redirectConfig;
var authController = require("../../server/core/controllers/core.server.controller").renderAuthError;


function defaultMissHandler(req, resp, next) {
  if (!req.session.userInfo) {
    resp.redirect('/');
  } else {
    authController(req, resp);
  }
}

function judgeIfhasVerticalPermission (role, targetUrl, method, config) {
  role = role.toLowerCase();
  method = method.toLowerCase();
  var targetConfig = config[role];
  for (var i = 0; i < targetConfig.url.length; i ++) {
    var current = targetConfig.url[i];
    if (current.resources.test(targetUrl)) {
      if (current.exclude) {
        return targetConfig.missHandler;
      }
      if (current.method['all']) {
        return true;
      }
      if (current.method[method]) {
        return true;
      }
      return targetConfig.missHandler;
    }
  }
  if (targetConfig.rootRole) {
    return judgeIfhasVerticalPermission(targetConfig.rootRole, targetUrl, method, config);
  } else {
    return targetConfig.missHandler;
  }
}

function initPermission(app) {
  app.use(function (req, resp, next) {
    if (req.session.isDeleted && req.session.isDeleted === 'true') {
      delete req.session.userInfo;
    }

    var userInfo = req.session.userInfo;
    var role;
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      role = userInfo.role;
    } else {
      role = 'notUser';
    }
    role = role.toLowerCase();
    var judgeResult = judgeIfhasVerticalPermission(role, req.url, req.method, permissionConfig);
    if (judgeResult === true) {
      next();
    }

    if (judgeResult !== true) {
      if (judgeResult) {
        judgeResult(req, resp, next);
      } else {
        defaultMissHandler(req, resp, next);
      }
    }
  });
  var shareUrls = Object.getOwnPropertyNames(redirectConfig);
  for (var i = 0; i < shareUrls.length; i ++) {
    var url = shareUrls[i];
    (function (url) {
      app.use(url, function (req, resp, next) {
        var userInfo = req.session.userInfo;
        var role = 'notUser';
        if (userInfo) {
          userInfo = JSON.parse(userInfo);
          role = userInfo.role;
        }
        var handler = null;


          role = role.toLowerCase();
          handler = redirectConfig[url][role] ? redirectConfig[url][role] : null;
          if (handler !== null) {
            handler(req, resp, next);

          }

        if (handler === null) {
          handler = redirectConfig[url]['default'];
          handler(req, resp, next);
        }
      });
    })(url);
  }
  return app;
}

module.exports.initPermission = initPermission;
