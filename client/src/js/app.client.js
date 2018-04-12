"use strict";

// Add regenerator-runtime for babel-loader
import './plugins/runtime'
import Bulma from './plugins/bulma.class'
import Client from './client.class'
import indexRouter from './routes/index.router'

const bootstrap = async () => {
    try {
        // Create client
        const client = new Client();
        // Initializing the User Interface
        client.bulma.init();
        if (client.config.debug) {
            console.log('Location controller/action: ', `${client.req.controller}/${client.req.action}`);
        }
        // Run router
        const result = await indexRouter(client);
        if (result === 'ok') {
            if (client.config.debug) {
                console.log(`Result: "OK"; Controller: "${client.req.controller}"; Action: "${client.req.action}";`);
            }
        } else {
            if (client.config.debug) {
                console.log(result);
            }
        }
    } catch (ex) {
        new Bulma()
            .init()
            .showError(ex)
    }
};

// Run bootstrap
bootstrap();



