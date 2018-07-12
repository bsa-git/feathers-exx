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
        this.http = new HttpBox(this.req);
    }

    /**
     * Restart server
     * @param app Application
     */
    async restartServer(app) {
        // Restart the server on port 3030
        if (this.req.app.get('httpServer')) {
            await this.req.app.get('httpServer').close();
            debug(`Feathers REST API closed at ${process.env.BASE_URL}:${process.env.EXX_PORT}`);
            this.createServer(app);
        } else {
            this.createServer(app);
        }
    }

    /**
     * Create http.server
     * @param app Application
     */
    createServer(app) {
        const self = this;
        const http = require('http');
        const httpServer = http.createServer(app);
        httpServer.listen(process.env.EXX_PORT);
        httpServer.on('listening', () => {
            self.req.app.set('httpServer', httpServer);
            const address = server.address();
            debug('Server.Address: ', address);
            debug(`Feathers REST API started at ${process.env.BASE_URL}:${process.env.EXX_PORT}`);
        });
    }

    /**
     * CORS middleware
     * @param app Application
     */
    corsMiddleware(app) {
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });
    }

    /**
     * Set rest transport
     * @param isCors Boolean
     * @return {*}
     */
    setRestTransport(isCors = true) {
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        //---------------------------------------------
        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());
        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());
        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());
        if (isCors) {
            this.corsMiddleware(app);
        }
        return app;
    }

    /**
     * Set socketio transports
     * @param app Application
     */
    setSocketioTransport(app) {
        const socketio = require('@feathersjs/socketio');
        //---------------------------------------------
        // Configure the Socket.io transport
        app.configure(socketio());
    }

    /**
     * Set real time events
     * @param app Application
     */
    setRealTimeEvents(app) {
        // On any real-time connection, add it to the 'everybody' channel
        app.on('connection', connection => app.channel('everybody').join(connection));
        // Publish all events to the 'everybody' channel
        app.publish(() => app.channel('everybody'));
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
