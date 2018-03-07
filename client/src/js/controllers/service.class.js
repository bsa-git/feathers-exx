"use strict";

import Base from './base.class'

class Service extends Base {
    constructor(client) {
        super(client);
    }

    /**
     * startClient - our first Feathers application on client
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

    /**
     * restApis - feathers application
     * @return Promise
     */
    restApis() {
        const self = this;
        const url = `${this.req.protocol}//${this.req.hostname}:${this.config.app.exxPort}/messages`;
        //---------------------------------

        // Render twig template
        const _twigRender = (data) => {
            const template = require('../tmpls/service/rest-apis/messages.html.twig');
            const html = template(data);
            self.bulma.addMessage(html);
        };

        // Show messages
        const _showMessages = async (id) => {
            // Find messages

            const messages = id ? await self.req.get(`${url}/${id}`) : await self.req.get(url);
            console.log(`HttpBox.get messages: `, messages);
            // Render twig template
            _twigRender({messages, url});
        };

        const MethodList = {
            create: async () => {
                // Find messages
                const messages = await self.req.get(url);
                // Create message
                const message = await self.req.post(url, {text: `Client create message-${messages.length + 1}`});
                console.log(`HttpBox.post message: `, message);
                _showMessages();
            },
            get: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const message = await self.req.get(`${url}/1`);
                    console.log(`HttpBox.get message: `, message);
                    _showMessages(1);
                } else {
                    console.log(`HttpBox.get messages: `, '[]');
                    _showMessages();
                }
            },
            find: async () => {
                _showMessages();
            },
            patch: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const message = await this.req.patch(`${url}/${messages.length}`, {text: 'Patch last client message'});
                    console.log(`HttpBox.patch message: `, message);
                }else {
                    console.log(`HttpBox.patch messages: `, '[]');
                    _showMessages();
                }
            },
            update: async () => {

            },
            delete: async () => {

            }
        };
        return Promise.reject(MethodList);
    }
}

export default Service
