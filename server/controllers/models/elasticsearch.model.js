"use strict";

const config = require('../../../config/env');
const collection = require('lodash/collection');
const Utils = require('../../../plugins/utils.class');
const elasticsearch = require('elasticsearch');
const es_config = config.api.database.elasticsearch;

const getModel = async (contrl) => {
    let responseData, arrData;
    //--------------------------
    // Get index information
    responseData = await contrl.http.get(`${es_config.connection_string}/_cat/indices?v`);
    arrData = Utils.strToObjectList(responseData);
    // If the index is not created, then create it
    if(collection.find(arrData, ['index', es_config.index]) === undefined){
        responseData = await contrl.http.put(`${es_config.connection_string}/${es_config.index}?pretty`);
        if(config.debug){
            console.log('Response Data: ', responseData);
        }
        console.log('Created index: ', es_config.index);
        // Delay time 1 sec
        await Utils.delayTime(1);
    }
    const Model = new elasticsearch.Client({
        host: es_config.connection_string,
        apiVersion: '6.2'
    });
    return {
        Model, elasticsearch: {
            index: es_config.index,
            type: es_config.type
        }
    }
};
module.exports = getModel;
