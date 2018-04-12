"use strict";

import 'jstorage'
import Bulma from './plugins/bulma.class'
import config from '../../../config/env/index.client'
import HttpBox from './plugins/http.client.class'

/**
 * Class of Client
 */
class Client {
    constructor() {
        this.storage = $.jStorage;
        this.bulma = new Bulma();
        this.config = config;
        this.req = new HttpBox();
        this.init();
    }

    /**
     * Init Application
     */
    init() {
        this.storage.set('config', config);
        this.storage.set('bulma', this.bulma);
        this.storage.set('req', this.req);
    }

    /**
     * Get value from storage
     * @param key String
     * @return {*}
     */
    get(key) {
        return this.storage(key)
    }

    /**
     * Set value for key to storage
     * @param key String
     * @param value {*}
     * @return {Application}
     */
    set(key, value) {
        this.storage.set(key, value);
        return this;
    }
}

export default Client


