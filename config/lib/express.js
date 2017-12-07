'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  cors = require('cors'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path'),
  _ = require('lodash'),
  lusca = require('lusca'),
  restify = require('express-restify-mongoose'),
  ueditor = require('ueditor-nodejs'),
  permission = require('./permission'),
  multipart = require('connect-multiparty');



/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg|image/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan) if enabled in the configuration file
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions('logs')));
  }

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json({
    limit: 1024 * 1024 * 5
  }));
  app.use('/weChat/applicant/personalInfo/submit',multipart({
    uploadDir : config.uploads.applicantsUpload.dest
  }));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
  app.use('/ueditor/ue', ueditor({//???/ueditor/ue???????????ueditor,?????,?????/ueditor???/ue
    configFile: '/customize_lib/ueditor/jsp/config.json',//??????jsp?,???/ueditor/jsp/config.json
    mode: 'local', //??????local
    // accessKey: 'Adxxxxxxx',//???????,bcs??
    //  secrectKey: 'oiUqt1VpH3fdxxxx',//???????,bcs??
    // staticPath: path.join(__dirname, 'public'), //???????,???????,???bcs,????
    staticPath: path.resolve('./public'),
    dynamicPath: '/upload' //????,?/??,bcs??buckect??,????/.??????req????,???????,function(req) { return '/xx'} req.query.action??????,uploadimage??????,????config.json.
  }));
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', config.viewPath);
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));

  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf.csp));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve(config.staticPath), {
    setHeaders : function (res, path, stat) {
      res.setHeader('Cache-Control', 'public, max-age=315360000000');
      res.setHeader('Expires', new Date(Date.now() + 3600 * 1000 * 24 * 365 * 10).toUTCString());
    }}));

  // Globbing static routing
  config.folders.client.forEach(function (staticPath) {
    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
  });
};

module.exports.initRestifyCors = function (app) {
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if (req.method == 'OPTIONS') {
      res.send(200); /让options请求快速返回/
    }
    //res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
};
/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

module.exports.initRestifyMongoose = function (app) {
  var router = express.Router();
  var mongoose = require('mongoose');
  restify.serve(router,mongoose.model('Position'));
  restify.serve(router,mongoose.model('Applicant'));
  restify.serve(router, mongoose.model('Company'));
  restify.serve(router, mongoose.model('District'));
  restify.serve(router, mongoose.model('CompanyInfoSegment'));
  restify.serve(router, mongoose.model('CompanyTemplate'));
  restify.serve(router, mongoose.model('Dictionary'));
  restify.serve(router, mongoose.model('Loginuser'));
  app.use(router);
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);
    logger.error(err.stack)
    require('fs').writeFile(require('path').join(process.cwd(),'public/error.html'), err.stack);
    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  var corsOptions = {
    "origin": "http://localhost:8080",
    "allowedHeaders" : "Content-Type, Content-Length, Authorization, Accept, X-Requested-With",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials" : true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
  // Initialize express app
  var app = express();

  app.use(cors(corsOptions))

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);


  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);
  app = permission.initPermission(app);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  this.initRestifyMongoose(app);

  //this.initRestifyCors(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  return app;
};
