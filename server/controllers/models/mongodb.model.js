"use strict";

const MongoClient = require('mongodb').MongoClient;

const getModel = async (app) => {
    const config = app.get('database')['mongodb'];
    const client = await MongoClient.connect(config.connection_string);
    const Model = client.db('dbFeathersExx').collection('messages');
    return Model
};

module.exports = getModel;