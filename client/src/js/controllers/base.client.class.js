"use strict";

const debug = require('debug')('app:base.controller');

class Base {
    constructor(client) {
        this.client = client ? client : {};
        this.bulma = this.client.bulma;
        this.req = this.client.req;
        this.data = this.client.data;
    }

    /**
     * Set rest transport
     * @return {*}
     */
    setRestTransport() {
        let restURL = `${this.req.protocol}//${this.req.hostname}`;
        if (process.env.NODE_ENV === 'development') {
            restURL += `:${this.data.port}`;
        }
        const feathers = require('@feathersjs/client/index');
        const axios = require('axios');
        //---------------------------------
        // Create app
        const app = feathers();
        // Connect to a different URL
        const restClient = feathers.rest(restURL);
        // Configure an AJAX library (see below) with that client
        app.configure(restClient.axios(axios));

        const authentication = require('@feathersjs/client/authentication');
        app.configure(authentication({
            storage: window.localStorage
        }));


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
