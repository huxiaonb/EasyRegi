'use strict';

exports.redirectConfig = {
  "/fail" : {
    "default" : function (req, resp, next) {
      resp.send("hello");
    }
  }
};
