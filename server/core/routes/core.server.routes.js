'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

    app.route('/login').get(core.renderLogin);
    app.route('/').get(core.renderLogin);
  // Define application route
  app.route('/back/*').get(core.renderIndex);

  //login
  //app.route('/login').get(core.renderLogin);

};
