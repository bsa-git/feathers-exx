"use strict";

// Add regenerator-runtime for babel-loader
import './plugins/webpack/runtime'
import 'jstorage'
import Bulma from './plugins/bulma/bulma.class'
import config from '../../../config/env/index.client'
import HttpBox from './plugins/http/http-box.class'
import indexRouter from './routes/index.router'

/**
 * Class Application
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

const bootstrap = async () =>{
    try {
        // Create Application
        const client = new Client();
        // Initializing the User Interface
        client.bulma.init();
        if (client.config.debug) {
            console.log('Location controller/action: ', `${client.req.controller}/${client.req.action}`);
        }
        // Run router
        const result = await indexRouter(client);
        if(result === 'ok'){
            if (client.config.debug) {
                console.log(`Result: "OK"; Controller: "${client.req.controller}"; Action: "${client.req.action}";`);
            }
        }else{
            if (client.config.debug) {
                console.log(result);
            }
        }
    } catch (ex) {
        new Bulma()
            .init()
            .showError({error: ex})
    }
};

// Run bootstrap
bootstrap();



