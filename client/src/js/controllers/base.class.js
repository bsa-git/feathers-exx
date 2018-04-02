"use strict";

class Base {
    constructor(client) {
        this.client = client ? client : {};
        this.bulma = this.client.bulma;
        this.config = this.client.config;
        this.req = this.client.req;
    }

    /**
     * Set rest transport
     * @return {*}
     */
    setRestTransport() {
        const restURL = `${this.req.protocol}//${this.req.hostname}:${this.config.api.exxPort}`;
        const feathers = require('@feathersjs/client');
        const axios = require('axios');
        //---------------------------------
        // Create app
        const app = feathers();
        // Connect to a different URL
        const restClient = feathers.rest(restURL);
        // Configure an AJAX library (see below) with that client
        // app.configure(restClient.axios(axios));
        app.configure(restClient.axios(axios));
        return app
    }

    /**
     * Strip slashes
     * @param name String
     * @return {XML|string|*|void}
     */
    static stripSlashes(name) {
        return name.replace(/^(\/*)|(\/*)$/g, '');
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
                        console.log('Loaded - ' + url);
                        if (callback) {
                            callback();
                        }
                        resolve('ok');
                    }
                };
            } else {  //Others
                script.onload = function () {
                    console.log('Loaded - ' + url);
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
