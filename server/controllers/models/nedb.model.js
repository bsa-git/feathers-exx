"use strict";

const NeDB = require('nedb');

module.exports = (app) =>{
    const config = app.get('database')['nedb'];
    return new NeDB(config);
};