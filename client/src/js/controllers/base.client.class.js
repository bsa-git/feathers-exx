"use strict";

const debug = require('debug')('app:base.controller');

class Base {
    constructor(client) {
        this.client = client ? client : {};
        this.bulma = this.client.bulma;
        // this.config = this.client.config;
        this.req = this.client.req;
    }

    /**
     * Set rest transport
     * @return {*}
     */
    setRestTransport() {
        const restURL = `${this.req.protocol}//${this.req.hostname}:${process.env.EXX_PORT}`;
        const feathers = require('@feathersjs/client');
        const axios = require('axios');
        //---------------------------------
        // Create app
        const app = feathers();
        // Connect to a different URL
        const restClient = feathers.rest(restURL);
        // Configure an AJAX library (see below) with that client
        app.configure(restClient.axios(axios));
        return app
    }

    /**
     * Load script
     * @param url String
     * @param callback Function
     * @return {Promise.<void>}
     */
    static loadScript(url, callback) {
        return new Promise(function(resolve, reject) {
            const script = document.createElement("script")
            script.type = "text/javascript";
            // script.async = false;

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        debug('Loaded - ' + url);
                        if (callback) {
                            callback();
                        }
                        resolve('ok');
                    }
                };
            } else {  //Others
                script.onload = function () {
                    debug('Loaded - ' + url);
                    if (callback) {
                        callback();
                    }
                    resolve('ok');
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        });
    }
}

export default Base