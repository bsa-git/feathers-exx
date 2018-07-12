"use strict";

const config = require('../../../config/db');
const NeDB = require('nedb');
// Create db
const db = new NeDB(config.nedb);

module.exports = db;