"use strict";

// Add regenerator-runtime for babel-loader
import './plugins/runtime'
import Bulma from './plugins/bulma.class'
import Client from './client.class'
import indexRouter from './routes/index.router'

const debug = require('debug')('app:client');

const bootstrap = async () => {
    // Create client
    const client = new Client();
    // Initializing the User Interface
    client.bulma.init();
    debug('Path controller/action: ', `${client.req.controller}/${client.req.action}`);
    // Run router
    const result = await indexRouter(client);
    if (result === 'ok') {
        return `Result: "OK"; Controller: "${client.req.controller}"; Action: "${client.req.action}";`;
    } else {
        return result;
    }
};

// Run bootstrap
bootstrap().then(
    result => {
        debug(result)
    },
    error => {
        new Bulma()
            .init()
            .showError(error)
    }
);



