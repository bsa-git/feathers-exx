"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Http = require('./plugins/http.class');

// Require routers
const index = require('./routes/index.router');
const service = require('./routes/service.router');
const auth = require('./routes/auth.router');
// Require middleware
const iniApp = require('./middleware/ini-app.server');

// Create APP
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// your favicon in /public
app.use(favicon(path.join(__dirname, '../client/public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/public')));

// Routers
app.use('*', iniApp);
app.use('/', index);
app.use('/service', service);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error(`Not Found: (Path "${req.baseUrl}${req.path}")`);
    err.code = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    err.code = err.code || 500;
    err.type = err.type ? err.type : Http.httpCodes()[err.code];
    err.stack = req.app.get('env') === 'development' ? err.stack : '';
    res.locals.error = err;

    // render the error page
    res.status(err.code);
    res.render('./tmpls/error/error.html.twig');
});

module.exports = app;
