"use strict";

import Base from './base.class'

class Service extends Base {
    constructor(client) {
        super(client);
    }
    /**
     * Our first Feathers application on client
     * @param name String
     * @return Promise
     */
    startClient(name) {
        const self = this;
        const feathers = require('@feathersjs/client');
        //----------------------------------------------
        const app = feathers();
        // Register a simple todos service that return the name and a text
        app.use('todos', {
            async get(name) {
                // Return an object in the form of { name, text }
                return {
                    name,
                    text: `You have to do ${name}`
                };
            }
        });
        // A function that gets and logs a todos from the service
        async function getTodo(name) {
            // Get the service we registered above
            const service = app.service('todos');
            // Call the `get` method with a name
            const todo = await service.get(name);
            // Render twig template
            const template = require('../tmpls/service/start-client/todo.html.twig');
            return template(todo);
        }
        return getTodo(name);
    }
}
export default Service
