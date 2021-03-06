"use strict";

const HttpBox = require('../../plugins/http.server.class');
const collection = require('lodash/collection');
const Utils = require('../../../plugins/utils.class');
const elasticsearch = require('elasticsearch');
const debug = require('debug')('app:elasticsearch.model');

//-----------------------------------------------

class Messages {

    constructor(app) {
        this.config = app.get('database')['elasticsearch'];
        this.http = new HttpBox();
    }

    /**
     * Find data
     * @param params Object
     * @return {Promise.<void>}
     */
    async find(params) {
        debug('find.params: ', params);
        const query = params.query ? params.query : this._getQuery(params.type);
        const data = await this._httpPost(query);
        // console.log('extractData: ', data);
        const extractData = this._extractData(params.type, data);
        return extractData;
    }

    /**
     * Get model
     * @return {Promise.<{Model: *, elasticsearch: {index: (*|string), type: (*|string)}}>}
     */
    async getModel() {
        const self = this;
        let responseData, arrData;
        //--------------------------
        // Get index information
        responseData = await this._getIndices();
        arrData = Utils.strToObjectList(responseData);
        // If the index is not created, then create it
        if (collection.find(arrData, ['index', self.config.index]) === undefined) {
            responseData = await this._createIndex();
            debug('Response Data: ', responseData);
            console.log('Created index: ', self.config.index);
            // Delay time 1 sec
            await Utils.delayTime(1);
        }
        const Model = new elasticsearch.Client({
            host: self.config.connection_string,
            apiVersion: '6.2'
        });
        return {
            Model, elasticsearch: {
                index: self.config.index,
                type: self.config.type
            }
        }
    };

    /**
     * Get indices
     * @param controller Object
     * @return {Promise.<void>}
     */
    async _getIndices() {
        return await this.http.get(`${this.config.connection_string}/_cat/indices?v`);
    };

    /**
     * Create index
     * @param controller Object
     * @return {Promise.<void>}
     */
    async _createIndex() {
        return await this.http.put(`${this.config.connection_string}/${this.config.index}?pretty`);
    };

    /**
     * Query ElasticSearch
     * @param query Object
     * @return {Promise.<void>}
     */
    async _httpPost(query) {
        return await this.http.post(`${this.config.connection_string}/${this.config.index}/${this.config.type}/_search`, query);
    };

    /**
     * Get an appropriate query
     * @param type String // Query type
     * @return {*} Object
     * @private
     */
    _getQuery(type) {
        let _query;
        switch (type) {
            case 'aggs-count-sum':
                _query = {
                    "size": 0,
                    "aggs": {
                        "group_by_sum": {
                            "sum": {"field": "counter"}
                        }
                    }
                };
                return _query;
                break;
            default:
                _query = {
                    "query": {"match_all": {}},
                    "sort": [{"counter": "asc"}]
                };
                return _query
        }
    }

    /**
     * Extract data
     * @param type String // Query type
     * @param data Object
     * @return {*}
     * @private
     */
    _extractData(type, data) {
        let _data;
        switch (type) {
            case 'aggs-count-sum':
                _data = {count: data.hits.total, sum: data.aggregations.group_by_sum.value};
                return _data;
                break;
            default:
                if(data.hits.hits.length){
                    _data = [];
                    collection.forEach(data.hits.hits, function (obj) {
                        _data.push({_id: obj._id, counter: obj._source.counter, message: obj._source.message});
                    });
                    return _data
                }else {
                    return data
                }

        }
    }
}

module.exports = Messages;
