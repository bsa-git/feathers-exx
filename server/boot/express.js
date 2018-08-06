'use strict';

const express = require('@feathersjs/express');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

module.exports = function (app) {

    // view engine setup
    app.set('views', app.get('views'));
    app.set('view engine', 'twig');

    app.use(cors());
    app.use(helmet());
    app.use(compress());
    // Turn on JSON body parsing for REST services
    app.use(express.json());
    // Turn on URL-encoded body parsing for REST services
    app.use(express.urlencoded({extended: true}));
    app.use(favicon(`${app.get('public')}/images/favicon.ico`));
    app.use(express.static(app.get('public')));

};