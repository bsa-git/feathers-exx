"use strict";

const config = require('../../../config/env');
const rdbConfig = config.api.database.rethinkdb;
const rethink = require('rethinkdbdash');

// Connect to a local RethinkDB server.
const model = rethink({
    db: rdbConfig.database
});


module.exports = {model, table: rdbConfig.table};