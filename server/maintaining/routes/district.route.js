'use strict';

/**
 * Module dependencies
 */
var districtController = require('../controllers/district.controller');

module.exports = function (app) {
     app.route('/api/district/getAllProvinces')
        .get(districtController.getAllProvinces);
     app.route('/api/district/getChildrens')
        .get(districtController.getChildrens);
};
