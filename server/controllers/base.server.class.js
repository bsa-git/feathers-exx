"use strict";

const fs = require('fs');
const path = require('path');
const HttpBox = require('../plugins/http.server.class');
const debug = require('debug')('app:base.controller');

class Base {
    constructor(context) {
        this.context = context ? context : {};
        this.req = this.context.req ? this.context.req : {};
        this.res = this.context.res ? this.context.res : {};
        // this.config = config;
        this.app = this.req.app;
        this.http = new HttpBox(this.req);
        this.port = this.app.get('port');
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
        // console.error('showError: ', err);
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
    }

    /**
     * Check env.js
     * If the env.js file is missing, an error occurs.
     */
    static isEnvJs() {
        try {
            const filePath = path.join(__dirname, '../../.env');
            fs.accessSync(filePath);
        } catch (err) {
            const errEnv = new Error(`Can not find '.env' file! <br>Please create a file '/.env', see the example '/.env.example'`);
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
