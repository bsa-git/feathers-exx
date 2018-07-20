// server/boot/express.js

const express = require('@feathersjs/express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const socketio = require('@feathersjs/socketio');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

module.exports = function (app) {

    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'twig');

    // your favicon in /public
    app.use(favicon(path.join(__dirname, '../../client/public/images', 'favicon.ico')));
    // Enable CORS, security, compression, favicon and body parsing
    app.use(cors());
    app.use(helmet());
    app.use(compress());
    // app.use(logger('dev'));
    // Turn on JSON body parsing for REST services
    app.use(express.json());
    // Turn on URL-encoded body parsing for REST services
    app.use(express.urlencoded({extended: true}));
    // Set up REST transport using Express
    app.configure(express.rest());
    // Configure the Socket.io transport
    app.configure(socketio());
    // On any real-time connection, add it to the 'everybody' channel
    app.on('connection', connection => app.channel('everybody').join(connection));
    // Publish all events to the 'everybody' channel
    app.publish(() => app.channel('everybody'));

    app.use(express.static(path.join(__dirname, '../../client/public')));

    // Configure a middleware for 404s and the error handler
    // app.use(express.notFound());
    app.use(express.errorHandler({logger}));

};