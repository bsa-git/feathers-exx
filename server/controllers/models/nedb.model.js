"use strict";

const NeDB = require('nedb');

module.exports = (app) =>{
    const config = app.get('database')['nedb']['messages'];
    return new NeDB(config);
};