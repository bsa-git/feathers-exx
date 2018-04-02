"use strict";

const config = require('../../../config/env');
const knex = require('knex');
// Create model
const dbCurrent = config.api.database.current;
const model = knex(config.api.database.knex[dbCurrent]);

module.exports = model;