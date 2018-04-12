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
        if(dataList.length > 0){
            keys = dataList[0].split(re);
            if(dataList.length === 1){
                for (let i = 0; i < keys.length; i++) {
                    objData[keys[i]] = null;
                }
                resultData.push(objData);
            }else {
                const valuesList = array.tail(dataList);
                collection.forEach(valuesList, function(value) {
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
    static delayTime(sec){
        return new Promise(function(resolve, reject) {
            setTimeout(() => resolve("done!"), sec * 1000);
        });
    }
}

module.exports = Utils;