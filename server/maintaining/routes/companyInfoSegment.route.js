'use strict';

module.exports = function (app) {
  var companyInfoSegmentController = require('../controllers/companyInfoSegment.controller');

  app.route('/api/companyInfoSegment/changeCompanySegmentLayout').put(companyInfoSegmentController.changeCompanySegmentLayout);
};