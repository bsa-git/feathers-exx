"use strict";

var moment = require('moment');

module.exports = ({ name }) => {
    return async context => {
        // Set date.time ex. "2014-09-08 08:02:17" (ISO 8601)
        context.data[name] = moment().format('YYYY-MM-DD HH:mm:ss');
        return context;
    }
};