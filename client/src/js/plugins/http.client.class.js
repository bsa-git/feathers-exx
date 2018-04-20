'use strict';

// import LocationHelper from 'location-helper'
import LocationHelper from './location-helper.class'
import axios from 'axios'

const Utils = require('../../../../plugins/utils.class');

/**
 * HttpBox class
 *
 var location = document.createElement("a");
 location.href = url ? url : window.location.href;
 // Props of LocationHelper
 this.url = location.href.split('?')[0];
 this.hash = location.hash;
 this.host = location.host;
 this.hostname = location.hostname;
 this.href = location.href;
 this.origin = location.origin;
 this.pathname = location.pathname;
 this.port = location.port;
 this.protocol = location.protocol;
 this.search = location.search;
 this.source = location;
 // Methods of LocationHelper
 this.mergeParams(params);
 this.setParams(params);
 this.getParams(name);
 this.removeParams(params)
 */
class HttpBox extends LocationHelper {
    constructor(url) {
        super(url);
        this.pathname = Utils.stripSlashes(this.pathname);
        this.controller = this._getControllerAction().controller;
        this.action = this._getControllerAction().action;
    }

    /**
     * Get controller/action
     * @return Object // { controller: 'controller', action: 'action' }
     */
    _getControllerAction() {
        let controller, action;
        const arrPathName = this.pathname ? this.pathname.split('/') : [];
        if (arrPathName.length === 0) {
            controller = 'index';
            action = 'index';
        } else if (arrPathName.length === 1) {
            controller = 'index';
            action = arrPathName[0];
        } else {
            controller = arrPathName[0];
            action = arrPathName[1];
        }
        return {controller, action}
    }

    /**
     * Get info location
     * @param url String
     */
    getInfoLocation(url) {
        const location = new LocationHelper(url);
        return location;
    }

    /**
     * Get method for axios
     * @param url String
     * @param config Object
     * @return {Promise.<void>}
     */
    async get(url, config) {
        try {
            const configDefault = {
                // headers: {'X-Requested-With': 'XMLHttpRequest'}
            };

            const _config = Object.assign(configDefault, config);
            const response = await axios.get(url, _config);
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.get Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                return response.data;
            } else {
                throw new TypeError(`HttpBox.get Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
            }
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    /**
     * Post method for axios
     * @param url String
     * @param data
     * @param config Object
     * @return {Promise.<void>}
     */
    async post(url, data, config) {
        try {
            const configDefault = {};
            const _config = Object.assign(configDefault, config);
            const response = await axios.post(url, data, _config);
            if (response.statusText !== 'Created') {
                throw new Error(`HttpBox.post Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                return response.data;
            } else {
                throw new TypeError(`HttpBox.post Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
            }
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    /**
     * Put method for axios
     * @param url String
     * @param data
     * @param config Object
     * @return {Promise.<void>}
     */
    async put(url, data, config) {
        try {
            const configDefault = {};
            const _config = Object.assign(configDefault, config);
            const response = await axios.put(url, data, _config);
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.put Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                return response.data;
            } else {
                throw new TypeError(`HttpBox.put Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
            }
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    /**
     * Patch method for axios
     * @param url String
     * @param data
     * @param config Object
     * @return {Promise.<void>}
     */
    async patch(url, data, config) {
        try {
            const configDefault = {};
            const _config = Object.assign(configDefault, config);
            const response = await axios.patch(url, data, _config);
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.patch Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                return response.data;
            } else {
                throw new TypeError(`HttpBox.patch Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
            }
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    /**
     * Delete method for axios
     * @param url String
     * @param config Object
     * @return {Promise.<void>}
     */
    async delete(url, config) {
        try {
            const configDefault = {};
            const _config = Object.assign(configDefault, config);
            const response = await axios.delete(url, _config);
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.delete Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            const contentType = response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                return response.data;
            } else {
                throw new TypeError(`HttpBox.delete Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
            }
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    axiosError(error) {
        console.log('Error.message: ', error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const contentType = error.response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                error.response_data = error.response.data ? JSON.stringify(error.response.data, "", 2) : '';
            }
            error.headers = JSON.stringify(error.response.headers, "", 2);
            error.status = error.response.status;
            error.statusText = error.response.statusText;
            error.request_info = JSON.stringify({
                url: error.response.config.url,
                method: error.response.config.method
            }, "", 2);
            console.log('Error.request.info: ', error.request_info);
            console.log('Error.response.status: ', error.response.status);
            console.log('Error.response.statusText: ', error.response.statusText);
            console.log('Error.response.headers: ', error.response.headers);
            if(error.response_data){
                console.log('Error.response.data: ', error.response.data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('Error.request: ', error.request);
        }
        throw error;
    }
}

export default HttpBox
