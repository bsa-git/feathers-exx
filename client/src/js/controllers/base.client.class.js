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
            storage: window.localStorage,
            cookie: 'feathers-jwt'
        }));
        return app
    }

    /**
     * getAccessToken
     * @param app
     * @return String
     */
    getAccessToken(app) {
        return app.get('accessToken')
    }

    /**
     * isAuth
     * @param app
     * @return Boolean
     */
    isAuth(app) {
        return !!app.get('accessToken')
    }

    /**
     * Get logged userId
     * @param app
     * @param response
     * @return {Promise.<void>}
     */
    async getLoggedUserId(app, response) {
        const payload = await app.passport.verifyJWT(response.accessToken);
        return payload.userId;
    }

    /**
     * getLoggedInUser
     * @param app
     * @param response
     * @return {Promise.<void>}
     */
    async getLoggedInUser(app, response) {
        const payload = await app.passport.verifyJWT(response.accessToken);
        return await app.service('users').get(payload.userId);
    }

    /**
     * Load script
     * @param url String
     * @param callback Function
     * @return {Promise.<void>}
     */
    static loadScript(url, callback) {
        return new Promise(function (resolve, reject) {
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

    /**
     * verifyJWT
     * Pass a jwt token, get back a payload if it's valid.
     *
     * @param token
     * @return {Promise.<void>}
     */
    async verifyJWT(token) {
        const decode = require('jwt-decode');
        //-----------------------------------
        const payloadIsValid = function payloadIsValid(payload) {
            return payload && (!payload.exp || payload.exp * 1000 > new Date().getTime());
        };

        if (typeof token !== 'string') {
            return Promise.reject(new Error('Token provided to verifyJWT is missing or not a string'));
        }

        try {
            let payload = decode(token);

            if (payloadIsValid(payload)) {
                return Promise.resolve(payload);
            }

            return Promise.reject(new Error('Invalid token: expired'));
        } catch (error) {
            return Promise.reject(new Error('Cannot decode malformed token.'));
        }
    }
}

export default Base
