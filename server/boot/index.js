'use strict';

const express = require("./express");
const rest = require("./rest");
const middleware = require("../middleware");
const authentication = require("./authentication");
const services = require("../services");
const channels = require("./channels");
const appHooks = require("./app.hooks");
const errorHandler = require("./error-handler");

module.exports = function (app) {
    express(app);
    rest(app);
    middleware(app);
    authentication(app);
    services(app);
    channels(app);
    appHooks(app);
    errorHandler(app);
};