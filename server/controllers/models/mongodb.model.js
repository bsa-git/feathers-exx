"use strict";

const config = require('../../../config/env');
const MongoClient = require('mongodb').MongoClient;

const getModel = async () => {
    const client = await MongoClient.connect(config.api.database.mongodb.connection_string);
    const Model = client.db('dbFeathersExx').collection('messages');
    return Model
};

module.exports = getModel;