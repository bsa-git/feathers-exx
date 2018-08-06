"use strict";

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const dotenv = require('dotenv');// Loads environment variables from .env file.
const debug = require('debug')('app:app');

// Load environment variables
dotenv.load();

// Create APP
const app = express(feathers());
app.configure(configuration());

// Boot
require('./boot/index')(app);

// Routing
require('./routes/index')(app);

debug('Bootstrap application - OK');

module.exports = app;
