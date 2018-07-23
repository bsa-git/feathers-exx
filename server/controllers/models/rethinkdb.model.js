"use strict";

const rethink = require('rethinkdbdash');

module.exports = (app) => {
    const config = app.get('database')['rethinkdb'];
    const model = rethink({
        db: config.database
    });

    return {model, table: config.table};
};