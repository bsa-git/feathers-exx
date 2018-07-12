"use strict";

const config = require('../../../config/db');
const MongoClient = require('mongodb').MongoClient;

const getModel = async () => {
    const client = await MongoClient.connect(config.mongodb.connection_string);
    const Model = client.db('dbFeathersExx').collection('messages');
    return Model
};

module.exports = getModel;