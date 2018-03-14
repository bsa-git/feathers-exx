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
     * REST api - feathers application
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
        const _showMessages = async (serviceMethod, httpMethod, id) => {
            // Find messages
            let messages = await self.req.get(url);
            const _url = id ? `${url}/${id}` : url;
            // Render twig template
            _twigRender({messages, url: _url, serviceMethod, httpMethod});
        };

        // Show message
        const _showMessage = async (serviceMethod, httpMethod, id) => {
            // Find messages
            const message = await self.req.get(`${url}/${id}`);
            const _url = `${url}/${id}`;
            const messages = [message];
            // Render twig template
            _twigRender({messages, url: _url, serviceMethod, httpMethod});
        };

        const MethodList = {
            create: async () => {
                // Find messages
                const messages = await self.req.get(url);
                // Create message
                const message = await self.req.post(url, {text: `Client create message-${messages.length + 1}`});
                console.log(`HttpBox.post message: `, message);
                _showMessages('create()', 'POST');
            },
            get: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await self.req.get(`${url}/${lastMessageId}`);
                    console.log(`HttpBox.get message: `, message);
                    _showMessage('get()', 'GET', lastMessageId);
                } else {
                    console.log(`HttpBox.get message: `, '[]');
                    _showMessages('get()', 'GET', 1);
                }
            },
            find: async () => {
                _showMessages('find()', 'GET');
            },
            patch: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await this.req.patch(`${url}/${lastMessageId}`, {text: `Client patch last message-${lastMessageId}`});
                    console.log(`HttpBox.patch message: `, message);
                    _showMessages('patch()', 'PATCH', lastMessageId);
                } else {
                    console.log(`HttpBox.patch messages: `, '[]');
                    _showMessages('patch()', 'PATCH', 1);
                }
            },
            update: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await this.req.put(`${url}/${lastMessageId}`, {text: `Client put last message-${lastMessageId}`});
                    console.log(`HttpBox.put message: `, message);
                    _showMessages('.update()', 'PUT', lastMessageId);
                } else {
                    console.log(`HttpBox.put messages: `, '[]');
                    _showMessages('update()', 'PUT', 1);
                }
            },
            delete: async () => {
                // Find messages
                const messages = await self.req.get(url);
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await this.req.delete(`${url}/${lastMessageId}`, {text: `Client delete last message-${lastMessageId}`});
                    console.log(`HttpBox.delete message: `, message);
                    _showMessages('remove()', 'DELETE', lastMessageId);
                } else {
                    console.log(`HttpBox.delete messages: `, '[]');
                    _showMessages('remove()', 'DELETE', 1);
                }
            }
        };
        return Promise.resolve(MethodList);
    }

    /**
     * REST Client - feathers application
     * @return Promise
     */
    restClient() {
        const self = this;
        const url = `${this.req.protocol}//${this.req.hostname}:${this.config.app.exxPort}/messages`;
        const restURL = `${this.req.protocol}//${this.req.hostname}:${this.config.app.exxPort}`;
        const feathers = require('@feathersjs/client');
        // const rest = require('@feathersjs/rest-client');
        const axios = require('axios');
        //---------------------------------

        const app = feathers();

        // Connect to a different URL
        const restClient = feathers.rest(restURL);

        // Configure an AJAX library (see below) with that client
        // app.configure(restClient.axios(axios));
        app.configure(restClient.axios(axios));

        // Connect to the `http://localhost:3030/messages` service
        const serviceMessages = app.service('messages');


        // Render twig template
        const _twigRender = (data) => {
            const template = require('../tmpls/service/rest-apis/messages.html.twig');
            const html = template(data);
            self.bulma.addMessage(html);
        };

        // Show messages
        const _showMessages = async (serviceMethod, httpMethod, id) => {
            // Find messages
            let messages = await  serviceMessages.find();
            const _url = id ? `${url}/${id}` : url;
            // Render twig template
            _twigRender({messages, url: _url, serviceMethod, httpMethod});
        };

        // Show message
        const _showMessage = async (serviceMethod, httpMethod, id) => {
            // Find messages
            const message = await serviceMessages.get(id);
            const _url = `${url}/${id}`;
            const messages = [message];
            // Render twig template
            _twigRender({messages, url: _url, serviceMethod, httpMethod});
        };

        const MethodList = {
            create: async () => {
                // Find messages
                const messages = await serviceMessages.find();
                const message = await serviceMessages.create({text: `Client create message-${messages.length + 1}`});
                console.log(`HttpBox.post message: `, message);
                _showMessages('create()', 'POST');
            },
            get: async () => {
                // Find messages
                const messages = await serviceMessages.find();
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await serviceMessages.get(lastMessageId);
                    console.log(`HttpBox.get message: `, message);
                    _showMessage('get()', 'GET', lastMessageId);
                } else {
                    console.log(`HttpBox.get message: `, '[]');
                    _showMessages('get()', 'GET', 1);
                }
            },
            find: async () => {
                _showMessages('find()', 'GET');
            },
            patch: async () => {
                // Find messages
                const messages = await serviceMessages.find();
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await serviceMessages.patch(lastMessageId, {text: `Client patch last message-${lastMessageId}`});
                    console.log(`HttpBox.patch message: `, message);
                    _showMessages('patch()', 'PATCH', lastMessageId);
                } else {
                    console.log(`HttpBox.patch messages: `, '[]');
                    _showMessages('patch()', 'PATCH', 1);
                }
            },
            update: async () => {
                // Find messages
                const messages = await serviceMessages.find();
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await serviceMessages.update(lastMessageId, {text: `Client put last message-${lastMessageId}`});
                    console.log(`HttpBox.put message: `, message);
                    _showMessages('.update()', 'PUT', lastMessageId);
                } else {
                    console.log(`HttpBox.put messages: `, '[]');
                    _showMessages('update()', 'PUT', 1);
                }
            },
            delete: async () => {
                // Find messages
                const messages = await serviceMessages.find();
                if (messages.length > 0) {
                    const lastMessageId = messages[messages.length - 1].id;
                    const message = await serviceMessages.remove(lastMessageId, {text: `Client delete last message-${lastMessageId}`});
                    console.log(`HttpBox.delete message: `, message);
                    _showMessages('remove()', 'DELETE', lastMessageId);
                } else {
                    console.log(`HttpBox.delete messages: `, '[]');
                    _showMessages('remove()', 'DELETE', 1);
                }
            }
        };
        return Promise.resolve(MethodList);
        // return Promise.resolve('ok');
    }
}

export default Service
