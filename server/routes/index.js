// server/routes/index.js

// Require routers
const index = require('./index.router');
const service = require('./service.router');
const auth = require('./auth.router');
const database = require('./database.router');

module.exports = function (app) {
    app.use('/', index);
    app.use('/service', service);
    app.use('/auth', auth);
    app.use('/database', database);
    // require("./error-handler")(app);
};