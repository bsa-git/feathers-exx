"use strict";

const config = require('../../../config/env');
const elasticsearch = require('elasticsearch');

const es_config = config.api.database.elasticsearch;
const Model = new elasticsearch.Client({
    host: es_config.connection_string,
    apiVersion: '6.2'
});

module.exports = {
    Model, elasticsearch: {
        index: es_config.index,
        type: es_config.type
    }
};