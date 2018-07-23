// server/boot/express.js

const express = require('@feathersjs/express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const compress = require('compression');
const helmet = require('helmet');

module.exports = function (app) {

    // view engine setup
    app.set('views', app.get('views'));
    app.set('view engine', 'twig');

    app.use(favicon(`${app.get('public')}/images/favicon.ico`));
    app.use(helmet());
    app.use(compress());
    app.use(express.static(app.get('public')));

    // Configure a middleware for error handler
    app.use(express.errorHandler({logger}));

};