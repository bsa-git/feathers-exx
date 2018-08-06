'use strict';

const express = require('@feathersjs/express');
const logger = require('morgan');

module.exports = function (app) {
    // Configure a middleware for error handler
    app.use(express.errorHandler({logger}));
};