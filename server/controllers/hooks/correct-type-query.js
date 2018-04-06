"use strict";

const ObjectID = require('mongodb').ObjectID;

/**
 * Get result convertation
 * @param type String  //{'int': 'toInteger', 'float': 'toNumber'}
 * @param value String
 * @return {*}
 */
const getResult = (type, value)=>{
    if(type === 'int') {
        return parseInt(value);
    } else if(type === 'float') {
        return parseFloat(value);
    } else if(type === 'ObjectID') {
        return new ObjectID(value);
    }
};

/**
 * Correct type query values
 * @param query Object
 * @param key String
 * @param type String
 */
const correctQuery = (query, key, type)=>{
    if(query[key]) {
        if(typeof query[key] === 'string') {
            query[key] = getResult(type, query[key]);
        } else if(typeof query[key]['$ne'] === 'string') {
            query[key]['$ne'] = getResult(type, query[key]['$ne']);
        } else if(typeof query[key]['$lt'] === 'string') {
            query[key]['$lt'] = getResult(type, query[key]['$lt']);
        } else if(typeof query[key]['$lte'] === 'string') {
            query[key]['$lte'] = getResult(type, query[key]['$lte']);
        } else if(typeof query[key]['$gt'] === 'string') {
            query[key]['$gt'] = getResult(type, query[key]['$gt']);
        } else if(typeof query[key]['$gte'] === 'string') {
            query[key]['$gte'] = getResult(type, query[key]['$gte']);
        } else if(query[key]['$in']) {
            query[key]['$in'] = query[key]['$in'].map(id => getResult(type, id))
        }
    }
} ;

/**
 * Correct type query values
 * @param props Object
 * @return {function(*)}
 */
module.exports = (props) => {
    return context => {
        const { query = {} } = context.params;
        Object.keys(props).forEach(function(key) {
            const value = props[key];
            if(query.$or){
                query.$or.forEach(function(orQuery) {
                    correctQuery(orQuery, key, value);
                });
            }else {
                correctQuery(query, key, value);
            }
        });
        return context;
    }
};