// sever/middleware/index.js

const initApp = require('./init-app');
const cors = require('./cors');

module.exports = function (app) {
    app.use(initApp);
    app.use(cors);
};