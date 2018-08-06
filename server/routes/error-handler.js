'use strict';


module.exports = function (app) {

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error(`Not Found: (Path "${req.baseUrl}${req.path}")`);
        err.code = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        const HttpBox = require('../plugins/http.server.class');
        //-------------------------------------------------

        // set locals, only providing error in development
        err.code = err.code || err.status || 500;
        err.type = err.type || err.statusText || HttpBox.httpCodes()[err.code];
        err.stack = req.app.get('env') === 'development' ? err.stack : '';
        err.request_info = err.request_info ? err.request_info : '';
        err.response_data = err.response_data ? err.response_data : '';
        res.locals.error = err;

        // render the error page
        res.status(err.code);
        res.render('./tmpls/error/error.html.twig');
    });
};