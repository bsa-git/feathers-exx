"use strict";

const array = require('lodash/array');
const collection = require('lodash/collection');

class Utils {

    /**
     * String to object list
     * @param str
     * @return {Array}
     */
    static strToObjectList(str) {
        const re = /\s+/;
        let objData = {};
        let dataList, keys, values;
        let resultData = [];
        //-------------------------
        dataList = str.split('\n');
        dataList = array.compact(dataList);
        if (dataList.length > 0) {
            keys = dataList[0].split(re);
            if (dataList.length === 1) {
                for (let i = 0; i < keys.length; i++) {
                    objData[keys[i]] = null;
                }
                resultData.push(objData);
            } else {
                const valuesList = array.tail(dataList);
                collection.forEach(valuesList, function (value) {
                    objData = {};
                    values = value.split(re);
                    for (let i = 0; i < keys.length; i++) {
                        objData[keys[i]] = values[i];
                    }
                    resultData.push(objData);
                });
            }
        }
        return resultData;
    }

    /**
     * Delay time
     * @param sec
     * @return {Promise}
     */
    static delayTime(sec) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => resolve("done!"), sec * 1000);
        });
    }

    /**
     * Strip slashes
     * @param name String
     * @return {XML|string|*|void}
     */
    static stripSlashes(name) {
        return name.replace(/^(\/*)|(\/*)$/g, '');
    }

    /**
     * Parse bool
     * @param b String|Any
     * @return boolean
     */
    static parseBool(b) {
        return !(/^(false|0)$/i).test(b) && !!b;
    }

    /**
     * Is true
     * @param value String|Any
     * @return boolean
     */
    static isTrue(value) {
        if (typeof(value) === 'string') {
            value = value.trim().toLowerCase();
        }
        switch (value) {
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
    }

    // Pass a jwt token, get back a payload if it's valid.
    /**
     * verifyJWT
     * @param token
     * @return {Promise.<void>}
     */
    static verifyJWT (token) {
        const decode = require('jwt-decode');
        const payloadIsValid = function payloadIsValid (payload) {
            return payload && (!payload.exp || payload.exp * 1000 > new Date().getTime());
        };

        if (typeof token !== 'string') {
            return Promise.reject(new Error('Token provided to verifyJWT is missing or not a string'));
        }

        try {
            let payload = decode(token);

            if (payloadIsValid(payload)) {
                return Promise.resolve(payload);
            }

            return Promise.reject(new Error('Invalid token: expired'));
        } catch (error) {
            return Promise.reject(new Error('Cannot decode malformed token.'));
        }
    }
}

module.exports = Utils;