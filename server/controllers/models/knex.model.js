"use strict";

const knex = require('knex');
module.exports = (app) => {
    const db_current = app.get('database')['db_current'];
    const config = app.get('database')['knex'][db_current];
    return knex(config);
};