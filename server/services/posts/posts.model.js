const NeDB = require('nedb');

module.exports = function (app) {
    const nedbConfig = app.get('database')['nedb']['posts'];
    const Model = new NeDB(nedbConfig);
    return Model;
};
