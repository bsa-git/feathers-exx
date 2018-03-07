'use strict';

import LocationHelper from 'location-helper'
import axios from 'axios'

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
        this.pathname = this.pathname.startsWith('/') ? this.pathname.slice(1) : this.pathname;
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
     * Get method for axios
     * @param url String
     * @param config Object
     * @return {Promise.<void>}
     */
    async get(url, config) {
        const configDefault = {
        };
        const _config = Object.assign(configDefault, config);
        const response = await axios.get(url, _config);
        if(response.statusText !== 'OK') {
            throw new Error(`HttpBox.get Error: Network response was not OK; url: '${url}'; config: `, _config);
        }
        const contentType = response.headers["content-type"];
        if(contentType && contentType.includes("application/json")) {
            return response.data;
        }else {
            throw new TypeError(`HttpBox.get Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
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
        const configDefault = {
        };
        const _config = Object.assign(configDefault, config);
        const response = await axios.post(url, data, _config);
        if(response.statusText !== 'Created') {
            throw new Error(`HttpBox.post Error: Network response was not OK; url: '${url}'; config: `, _config);
        }
        const contentType = response.headers["content-type"];
        if(contentType && contentType.includes("application/json")) {
            return response.data;
        }else {
            throw new TypeError(`HttpBox.post Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
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
        const configDefault = {
        };
        const _config = Object.assign(configDefault, config);
        const response = await axios.put(url, data, _config);
        if(response.statusText !== 'OK') {
            throw new Error(`HttpBox.put Error: Network response was not OK; url: '${url}'; config: `, _config);
        }
        const contentType = response.headers["content-type"];
        if(contentType && contentType.includes("application/json")) {
            return response.data;
        }else {
            throw new TypeError(`HttpBox.put Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
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
        const configDefault = {
        };
        const _config = Object.assign(configDefault, config);
        const response = await axios.patch(url, data, _config);
        if(response.statusText !== 'OK') {
            throw new Error(`HttpBox.patch Error: Network response was not OK; url: '${url}'; config: `, _config);
        }
        const contentType = response.headers["content-type"];
        if(contentType && contentType.includes("application/json")) {
            return response.data;
        }else {
            throw new TypeError(`HttpBox.patch Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
        }
    }

    /**
     * Delete method for axios
     * @param url String
     * @param data
     * @param config Object
     * @return {Promise.<void>}
     */
    async delete(url, config) {
        const configDefault = {
        };
        const _config = Object.assign(configDefault, config);
        const response = await axios.delete(url, _config);
        if(response.statusText !== 'OK') {
            throw new Error(`HttpBox.delete Error: Network response was not OK; url: '${url}'; config: `, _config);
        }
        const contentType = response.headers["content-type"];
        if(contentType && contentType.includes("application/json")) {
            return response.data;
        }else {
            throw new TypeError(`HttpBox.delete Error:  we haven't got JSON;  url: '${url}'; config: `, _config);
        }
    }
}

export default HttpBox
