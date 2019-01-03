var express = require('express');
var cors = require('cors');
var path = require('path');
// var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var config = require(path.join(__dirname, 'config', 'config.json'))[env];
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var debug = require('debug')('tbp_react');

var NodeCache = require("node-cache");

var ttlShort = 60 * 10 // seconds * minutes
var shortCache = new NodeCache({
  stdTTL: ttlShort, // seconds * minutes
  checkperiod: ttlShort + 2
});

// ==============

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');  NO LONGER USING ejs FILES.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

// app.use(logger('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, '..', 'public'), {
  extensions: false,
  index: false
}));
app.use(express.static(path.join(__dirname, 'build')));

// to directly serve images:
app.use(express.static(path.join(config.albumsRoot)));

// --------- Services ----------

var auth = require('./routes/auth'); // Login
auth.init(function (err, router) {
  app.use('/api/auth', router);
});

var albums = require('./routes/albums');
albums.init(shortCache, function (err, router) {
  app.use('/api/albums', router);
});

var monitor = require('./routes/monitor');
monitor.init(function (err, router) {
  if (err) {
    console.error("Error: ", err);
  }
  app.use('/api/monitor', router);
});

app.get('/api/env', function (req, res) {
  res.status(200).send(JSON.stringify({
    "env": env
  }, undefined, (req.query.pretty === 'yes' ? 2 : undefined)) + '\n');
})
// -------------- end Services -----------

app.all('/*', function (req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('public/index.html', {
    root: __dirname + '/../'
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404: ", req.method, req.url);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: {}
  });
});

module.exports = app;