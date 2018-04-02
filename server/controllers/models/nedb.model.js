"use strict";

const config = require('../../../config/env');
const NeDB = require('nedb');
// Create db
const db = new NeDB(config.api.database.nedb);

module.exports = db;