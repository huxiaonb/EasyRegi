'use strict';

var _ = require('lodash'),
  config = require('../config'),
  chalk = require('chalk'),
  fs = require('fs'),
  winston = require('winston'),
  FileStreamRotator = require('file-stream-rotator'),
  path = require('path'),
  moment = require('moment');
const logDir = 'logs';
// list of valid formats for the logging
var validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];
const tsFormat = () => (new Date()).toLocaleString();

function dateFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};

function formatter(args) {
    var logMessage = dateFormat() + ' - ' + args.level + ': ['+process.pid+'] ' + args.message;
    if(args.level=='error'){
        logMessage = logMessage + '\n'+ args.meta.stack;
    }
    return logMessage;
}

function getInfoLevelFileName(){
  var date = new Date(),
      month = '',
      day = '',
      realMonthNum = 0;
  realMonthNum = date.getMonth() + 1;
  if(date.getMonth() < 10) {
    month = '0' + realMonthNum.toString();
  } else {
    month = realMonthNum.toString();
  }
  if(date.getDate() < 10) {
    day = '0' + date.getDate().toString();
  } else {
    day = date.getDate().toString();
  }
  var postfix = date.getFullYear().toString() + month + day;
  return 'logs/info-' + postfix + '.log';
}
fs.existsSync(config.log.options.logdir) || fs.mkdirSync(config.log.options.logdir)

// Instantiating the default winston application logger with the Console
// transport
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: tsFormat,
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      formatter: formatter
    }),
    new (winston.transports.File)({
      name: 'info-file',
      level: 'info',
      timestamp: tsFormat,
      filename: 'logs/info.log',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      maxsize:1024*1024*10,
      formatter: formatter
    }),
    new (winston.transports.File)({
      name: 'error-file',
      level: 'error',
      timestamp: tsFormat,
      filename: 'logs/exception.log',
      maxsize:1024*1024*10,
      formatter: formatter
    })
  ],
  exitOnError: false
});

// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
logger.stream = {
  write: function(msg) {
    logger.info(msg);
  }
};

/**
 * Instantiate a winston's File transport for disk file logging
 *
 * @param logger a valid winston logger object
 */
logger.setupFileLogger = function setupFileLogger(options) {

  var fileLoggerTransport = this.getLogOptions();
  if (!fileLoggerTransport) {
    return false;
  }

  try {
    // Check first if the configured path is writable and only then
    // instantiate the file logging transport
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(winston.transports.File, fileLoggerTransport);
    }

    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
      console.log(chalk.red(err));
      console.log();
    }

    return false;
  }

};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
logger.getLogOptions = function getLogOptions(configOptions) {

  var _config = _.clone(config, true);
  if (configOptions) {
    _config = configOptions;
  }

  var configFileLogger = _config.log.fileLogger;

  if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
    console.log('unable to find logging file configuration');
    return false;
  }

  var logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;
  console.log(logPath)
  return {
    level: 'info',
    colorize: false,
    filename: logPath,
    timestamp: tsFormat,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    datePattern:'.yyyy-MM-dd.log',
  };

};

/**
 * The options to use with morgan logger
 *
 * Returns a log.options object with a writable stream based on winston
 * file logging transport (if available)
 */
logger.getMorganOptions = function getMorganOptions(logDirectory) {
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  return {
    stream: FileStreamRotator.getStream({
      date_format: 'YYYYMMDD',
      filename: path.join(logDirectory, 'access-%DATE%.log'),
      frequency: 'daily',
      verbose: false
    })
  }

};

/**
 * The format to use with the logger
 *
 * Returns the log.format option set in the current environment configuration
 */
logger.getLogFormat = function getLogFormat() {
  var format = config.log && config.log.format ? config.log.format.toString() : 'combined';

  // make sure we have a valid format
  if (!_.includes(validFormats, format)) {
    format = 'combined';

    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.yellow('Warning: An invalid format was provided. The logger will use the default format of "' + format + '"'));
      console.log();
    }
  }

  return format;
};

// logger.setupFileLogger({});

module.exports = logger;
