"use strict";

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const dotenv = require('dotenv');// Loads environment variables from .env file.
const debug = require('debug')('app:app');

// Load environment variables
dotenv.load();
// Load configuration variables
const conf = configuration();

// Create APP
const app = express(feathers());
app.configure(conf);

// Boot
require('./boot/index')(app);

// Middleware
require('./middleware/index')(app);

// Routing
require('./routes/index')(app);

debug('Bootstrap application - OK');

module.exports = app;
