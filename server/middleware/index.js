// sever/middleware/index.js

const initApp = require('./init-app');
const cors = require('./cors');

module.exports = function (app) {
    app.use(initApp);

    if (process.env.IS_CORS === 'true') {
        app.use(cors);
    }
};