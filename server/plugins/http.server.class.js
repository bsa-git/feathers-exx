"use strict";

const axios = require('axios');
const Utils = require('../../plugins/utils.class');

/**
 * HttpBox - http functions
 *
 *
 * JavaScript
 *
 * @author   Sergii Beskorovainyi <bsa2657@yandex.ru>
 * @license  MIT <http://www.opensource.org/licenses/mit-license.php>
 * @link     https://github.com/bsa-git/feathers-exx/
 */
class HttpBox {
    constructor(req) {
        this.request = req ? req : {};
    }

    static httpConst() {
        return {
            HTTP_CONTINUE: 100,
            HTTP_SWITCHING_PROTOCOLS: 101,
            HTTP_PROCESSING: 102,            // RFC2518
            HTTP_OK: 200,
            HTTP_CREATED: 201,
            HTTP_ACCEPTED: 202,
            HTTP_NON_AUTHORITATIVE_INFORMATION: 203,
            HTTP_NO_CONTENT: 204,
            HTTP_RESET_CONTENT: 205,
            HTTP_PARTIAL_CONTENT: 206,
            HTTP_MULTI_STATUS: 207,          // RFC4918
            HTTP_ALREADY_REPORTED: 208,      // RFC5842
            HTTP_IM_USED: 226,               // RFC3229
            HTTP_MULTIPLE_CHOICES: 300,
            HTTP_MOVED_PERMANENTLY: 301,
            HTTP_FOUND: 302,
            HTTP_SEE_OTHER: 303,
            HTTP_NOT_MODIFIED: 304,
            HTTP_USE_PROXY: 305,
            HTTP_RESERVED: 306,
            HTTP_TEMPORARY_REDIRECT: 307,
            HTTP_PERMANENTLY_REDIRECT: 308,  // RFC7238
            HTTP_BAD_REQUEST: 400,
            HTTP_UNAUTHORIZED: 401,
            HTTP_PAYMENT_REQUIRED: 402,
            HTTP_FORBIDDEN: 403,
            HTTP_NOT_FOUND: 404,
            HTTP_METHOD_NOT_ALLOWED: 405,
            HTTP_NOT_ACCEPTABLE: 406,
            HTTP_PROXY_AUTHENTICATION_REQUIRED: 407,
            HTTP_REQUEST_TIMEOUT: 408,
            HTTP_CONFLICT: 409,
            HTTP_GONE: 410,
            HTTP_LENGTH_REQUIRED: 411,
            HTTP_PRECONDITION_FAILED: 412,
            HTTP_REQUEST_ENTITY_TOO_LARGE: 413,
            HTTP_REQUEST_URI_TOO_LONG: 414,
            HTTP_UNSUPPORTED_MEDIA_TYPE: 415,
            HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: 416,
            HTTP_EXPECTATION_FAILED: 417,
            HTTP_I_AM_A_TEAPOT: 418,                                               // RFC2324
            HTTP_UNPROCESSABLE_ENTITY: 422,                                        // RFC4918
            HTTP_LOCKED: 423,                                                      // RFC4918
            HTTP_FAILED_DEPENDENCY: 424,                                           // RFC4918
            HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL: 425,   // RFC2817
            HTTP_UPGRADE_REQUIRED: 426,                                            // RFC2817
            HTTP_PRECONDITION_REQUIRED: 428,                                       // RFC6585
            HTTP_TOO_MANY_REQUESTS: 429,                                           // RFC6585
            HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: 431,                             // RFC6585
            HTTP_INTERNAL_SERVER_ERROR: 500,
            HTTP_NOT_IMPLEMENTED: 501,
            HTTP_BAD_GATEWAY: 502,
            HTTP_SERVICE_UNAVAILABLE: 503,
            HTTP_GATEWAY_TIMEOUT: 504,
            HTTP_VERSION_NOT_SUPPORTED: 505,
            HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: 506,                        // RFC2295
            HTTP_INSUFFICIENT_STORAGE: 507,                                        // RFC4918
            HTTP_LOOP_DETECTED: 508,                                               // RFC5842
            HTTP_NOT_EXTENDED: 510,                                                // RFC2774
            HTTP_NETWORK_AUTHENTICATION_REQUIRED: 511
        };
    }

    static httpCodes() {
        return {
            100: 'Continue',
            101: 'Switching Protocols',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            305: 'Use Proxy',
            306: '(Unused)',
            307: 'Temporary Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Request Entity Too Large',
            414: 'Request-URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Requested Range Not Satisfiable',
            417: 'Expectation Failed',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported'
        }
    }

    static mimeTypes() {
        return {
            txt: 'text/plain',
            htm: 'text/html',
            html: 'text/html',
            php: 'text/html',
            css: 'text/css',
            js: 'application/javascript',
            json: 'application/json',
            xml: 'application/xml',
            swf: 'application/x-shockwave-flash',
            flv: 'video/x-flv',
            // images
            png: 'image/png',
            jpe: 'image/jpeg',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            gif: 'image/gif',
            bmp: 'image/bmp',
            ico: 'image/vnd.microsoft.icon',
            tiff: 'image/tiff',
            tif: 'image/tiff',
            svg: 'image/svg+xml',
            svgz: 'image/svg+xml',
            // archives
            zip: 'application/zip',
            rar: 'application/x-rar-compressed',
            exe: 'application/x-msdownload',
            msi: 'application/x-msdownload',
            cab: 'application/vnd.ms-cab-compressed',
            // audio/video
            mp3: 'audio/mpeg',
            qt: 'video/quicktime',
            mov: 'video/quicktime',
            // adobe
            pdf: 'application/pdf',
            psd: 'image/vnd.adobe.photoshop',
            ai: 'application/postscript',
            eps: 'application/postscript',
            ps: 'application/postscript',
            // ms office
            doc: 'application/msword',
            rtf: 'application/rtf',
            xls: 'application/vnd.ms-excel',
            ppt: 'application/vnd.ms-powerpoint',
            // open office
            odt: 'application/vnd.oasis.opendocument.text',
            ods: 'application/vnd.oasis.opendocument.spreadsheet'
        }
    }

    static getHttpCode(code) {
        return HttpBox.httpCodes[code]
    }

    static getMimeType(type) {
        return HttpBox.mimeTypes[type]
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
            return response.data;
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
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.post Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            return response.data;
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
            return response.data;
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
            return response.data;
        } catch (ex) {
            this.axiosError(ex);
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
        try {
            const configDefault = {};
            const _config = Object.assign(configDefault, config);
            const response = await axios.delete(url, _config);
            if (response.statusText !== 'OK') {
                throw new Error(`HttpBox.delete Error: Network response was not OK; url: '${url}'; config: `, _config);
            }
            return response.data;
        } catch (ex) {
            this.axiosError(ex);
        }
    }

    axiosError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const contentType = error.response.headers["content-type"];
            if (contentType && contentType.includes("application/json")) {
                error.response_data = error.response.data ? JSON.stringify(error.response.data, "", 2) : '';
            } else {
                error.response_data = error.response.data ? error.response.data : '';
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
            console.log('Error.response.data: ', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('Error.request: ', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error.message', error.message);
        }
        throw error;
    }

    getMethod() {
        return this.request.method
    }

    isGet() {
        return (this.request.method === 'GET')
    }

    isPost() {
        return (this.request.method === 'POST')
    }

    isPut() {
        return (this.request.method === 'PUT')
    }

    isDelete() {
        return (this.request.method === 'DELETE')
    }

    isJson() {
        return this.request.is('application/json') === 'application/json';
    }

    isXml() {
        return this.request.is('application/xml') === 'application/xml';
    }

    isHtml() {
        return this.request.is('text/html') === 'text/html';
    }

    isForm() {
        return this.request.is('application/x-www-form-urlencoded') === 'application/x-www-form-urlencoded';
    }

    isAjax() {
        return this.request.xhr;
    }

    /**
     * getProtocol
     *
     * ex. // Host: "https://example.com:3000"
     *     // => "https"
     */
    getProtocol() {
        return this.request.protocol;
    }

    /**
     * getHost
     *
     * ex. // Host: "example.com:3000"
     *     // => "example.com"
     */
    getHost() {
        return this.request.hostname;
    }

    /**
     * getIp
     *
     * ex. // => "127.0.0.1"
     */
    getIp() {
        return this.request.ip;
    }

    /**
     * getPath
     *
     * ex. // example.com/users?sort=desc
     *     // => "/users"
     */
    getPath() { //
        return   this.request.path;
    }

    /**
     * getPort
     *
     * ex. // https://example.com:3000/users?sort=desc
     *     // => "3000"
     */
    getPort() { //
        return this.request.app.get('port');
    }

    /**
     * getHostAndPath
     *
     * ex. // https://example.com/service/users?sort=desc
     *     // => "https://example.com/service/users"
     */
    getHostAndPath() {
        const originalUrl = this.getOriginalUrl().split('?')[0];
        return   `${this.getProtocol()}://${this.getHost()}:${this.getPort()}${originalUrl}`;
    }

    /**
     * getBaseUrl
     *
     * ex.  // /greet/jp
     *      // => "/greet"
     */
    getBaseUrl() { //
        return this.request.baseUrl;
    }

    /**
     * getUrl
     *
     * ex. // GET /search?q=something
     *     // => "/search?q=something"
     */
    getOriginalUrl() { //
        return this.request.originalUrl;
    }

    /**
     * getParams
     * For example, if you have the route /user/:name, then the “name”
     * property is available as req.params.name.
     *
     * ex. // example.com/users?sort=desc
     *     // => "/users"
     */
    getParams() { //
        return this.request.params;
    }

    /**
     * getQuery
     *
     * ex. // GET /search?q=tobi+ferret // req.query.q // => "tobi ferret"
     */
    getQuery() { //
        return this.request.query;
    }

    getBody() {
        return this.request.body;
    }

    getCookies() {
        return this.request.cookies;
    }
}

module.exports = HttpBox;
