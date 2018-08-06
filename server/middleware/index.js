'use strict';

const initApp = require('./init-app');

module.exports = function (app) {
    app.use(initApp);
};