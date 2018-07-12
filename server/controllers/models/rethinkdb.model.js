"use strict";

const config = require('../../../config/db');
const rdbConfig = config.rethinkdb;
const rethink = require('rethinkdbdash');

// Connect to a local RethinkDB server.
const model = rethink({
    db: rdbConfig.database
});


module.exports = {model, table: rdbConfig.table};