'use strict';

const NeDB = require('nedb');

module.exports = function (app) {
    const nedbConfig = app.get('database')['nedb']['users'];
    const Model = new NeDB(nedbConfig);
    Model.ensureIndex({fieldName: 'email', unique: true});

    return Model;
};
