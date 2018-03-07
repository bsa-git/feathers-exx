"use strict";

const fs = require('fs');
const path = require('path');
const Http = require('../plugins/http.class');
const config = require('../../config/env');

class Base {
    constructor(context) {
        this.context = context ? context : {};
        this.req = this.context.req ? this.context.req : {};
        this.res = this.context.res ? this.context.res : {};
        this.config = config;
    }

    /**
     * Create http.server
     * @param app Application
     */
    createServer(app) {
        const self = this;
        const http = require('http');
        const httpServer = http.createServer(app);
        httpServer.listen(this.config.app.exxPort);
        httpServer.on('listening', () => {
            self.req.app.set('httpServer', httpServer);
            console.log(`Feathers REST API started at http://localhost:${self.config.app.exxPort}`);
        });
    }

    /**
     * Render Twig template
     * @param fileName String
     * @param data {*}
     * @return String | Error
     */
    static twigRender(fileName, req, data) {
        return new Promise(function (resolve, reject) {
            const Twig = require('twig');
            const filePath = path.join(__dirname, `../views/tmpls/${req.controller}/${req.action}/${fileName}`);
            Twig.renderFile(filePath, data, (err, html) => {
                if (err) {
                    reject(err);
                }
                resolve(html);
            });
        });
    }

    /**
     * Show error
     * @param err Error
     * @param req Request
     * @param res Response
     */
    static showError(err, req, res) {
        console.error('showError: ', err);
        // set locals, only providing error in development
        err.code = err.code || 500;
        err.type = err.type ? err.type : Http.httpCodes()[err.code];
        err.stack = req.app.get('env') === 'development' ? err.stack : '';
        res.locals.error = err;
        // render the error page
        res.status(err.code);
        res.render('./tmpls/error/error.html.twig');
    }

    /**
     * Check env.js
     * If the env.js file is missing, an error occurs.
     */
    static isEnvJs() {
        try {
            const filePath = path.join(__dirname, '../../env.js');
            fs.accessSync(filePath);
        } catch (err) {
            const errEnv = new Error(`Can not find 'env.js' file! <br>Please create a file '/env.js', see the example '/env.examples.js'`);
            errEnv.code = 500;
            throw errEnv;
        }
    }

    /**
     * Get controller/action
     * @param baseUrl String
     * @return Object
     */
    static getControllerAction(baseUrl) {
        let controller, action;
        baseUrl = baseUrl.startsWith('/') ? baseUrl.slice(1) : baseUrl;
        const arrBaseUrl = baseUrl ? baseUrl.split('/') : [];
        if (arrBaseUrl.length === 0) {
            controller = 'index';
            action = 'index';
        } else if (arrBaseUrl.length === 1) {
            controller = 'index';
            action = arrBaseUrl[0];
        } else {
            controller = arrBaseUrl[0];
            action = arrBaseUrl[1];
        }
        return {controller, action}
    }
}

module.exports = Base;
