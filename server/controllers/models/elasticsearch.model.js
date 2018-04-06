"use strict";

const config = require('../../../config/env');
const elasticsearch = require('elasticsearch');

const Model = new elasticsearch.Client({
    host: config.api.database.elasticsearch.connection_string,
    apiVersion: '6.2'
});

module.exports = {
    Model, elasticsearch: {
        index: 'db_feathers_exx',
        type: 'messages'
    }
};