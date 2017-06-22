'use strict';

/**
 * Module dependencies
 */
var positionController = require('../controllers/position.controller');

module.exports = function (app) {

    app.route('/api/position/publish')
        .put(positionController.publish);

    app.route('/api/position/stoppublish')
        .put(positionController.stopPublish);

    app.route('/api/position/preview')
        .get(positionController.preview);

    app.route('/api/position/delete')
        .post(positionController.deletePosition);
};


