"use strict";

// const express = require('express');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const dotenv = require('dotenv');// Loads environment variables from .env file.
const debug = require('debug')('app:app');

// Load environment variables
dotenv.load();

// Create APP
// const app = express();
const app = express(feathers());

// Boot
require('./boot/index')(app);

// Middleware
require('./middleware/index')(app);

// Routing
require('./routes/index')(app);

debug('Bootstrap application - OK');

module.exports = app;
