'use strict';

/**
 * Module dependencies
 */
var applicantController = require('../controllers/applicant.controller');

module.exports = function (app) {
     app.route('/applicant/preview/:id')
        .get(applicantController.renderPreviewPage);
};
