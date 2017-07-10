'use strict';

/**
 * Module dependencies
 */
var applicantController = require('../controllers/applicant.controller');

module.exports = function (app) {
     app.route('/api/applicant/renderPreviewPage/:id')
        .get(applicantController.renderPreviewPage);
};
