"use strict";

const knex = require('knex');
// Create model
const config = require('../../../config/db');
const model = knex(config.knex[process.env.DB_CURRENT]);

module.exports = model;