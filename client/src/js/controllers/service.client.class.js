"use strict";

import Base from './base.client.class'
const debug = require('debug')('app:service.controller');

class Service extends Base {
    constructor(client) {
        super(client);
        this.urlService = `${this.req.protocol}//${this.req.hostname}:${process.env.EXX_PORT}/messages`;
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
        //---------------------------------
        const MethodList = {
            create: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(self.urlService);
                    // Create message
                    const message = await self.req.post(self.urlService, {text: `Client create message-${messages.length + 1}`});
                    debug(`HttpBox.post message: `, message);
                    await self._showMessages('create()', 'POST');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            get: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(self.urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await self.req.get(`${self.urlService}/${lastMessageId}`);
                        debug(`HttpBox.get message: `, message);
                        await self._showMessage('get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages('get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages('find()', 'GET');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            patch: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(self.urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.patch(`${self.urlService}/${lastMessageId}`, {text: `Client patch last message-${lastMessageId}`});
                        debug(`HttpBox.patch message: `, message);
                        await self._showMessages('patch()', 'PATCH', lastMessageId);
                    } else {
                        debug(`HttpBox.patch messages: `, '[]');
                        await self._showMessages('patch()', 'PATCH', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            update: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(self.urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.put(`${self.urlService}/${lastMessageId}`, {text: `Client put last message-${lastMessageId}`});
                        debug(`HttpBox.put message: `, message);
                        await self._showMessages('.update()', 'PUT', lastMessageId);
                    } else {
                        debug(`HttpBox.put messages: `, '[]');
                        await self._showMessages('update()', 'PUT', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            delete: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(self.urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.delete(`${self.urlService}/${lastMessageId}`, {text: `Client delete last message-${lastMessageId}`});
                        debug(`HttpBox.delete message: `, message);
                        await self._showMessages('remove()', 'DELETE', lastMessageId);
                    } else {
                        debug(`HttpBox.delete messages: `, '[]');
                        await self._showMessages('remove()', 'DELETE', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
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
        //---------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Connect to the `http://localhost:3030/messages` service
        const serviceMessages = app.service('messages');
        const MethodList = {
            create: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    const message = await serviceMessages.create({text: `Client create message-${messages.length + 1}`});
                    debug(`HttpBox.post message: `, message);
                    await self._showMessages('create()', 'POST');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            get: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await serviceMessages.get(lastMessageId);
                        debug(`HttpBox.get message: `, message);
                        await self._showMessage('get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages('get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages('find()', 'GET');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            patch: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await serviceMessages.patch(lastMessageId, {text: `Client patch last message-${lastMessageId}`});
                        debug(`HttpBox.patch message: `, message);
                        await self._showMessages('patch()', 'PATCH', lastMessageId);
                    } else {
                        debug(`HttpBox.patch messages: `, '[]');
                        await self._showMessages('patch()', 'PATCH', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            update: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await serviceMessages.update(lastMessageId, {text: `Client put last message-${lastMessageId}`});
                        debug(`HttpBox.put message: `, message);
                        await self._showMessages('.update()', 'PUT', lastMessageId);
                    } else {
                        debug(`HttpBox.put messages: `, '[]');
                        await self._showMessages('update()', 'PUT', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            delete: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await serviceMessages.remove(lastMessageId, {text: `Client delete last message-${lastMessageId}`});
                        debug(`HttpBox.delete message: `, message);
                        await self._showMessages('remove()', 'DELETE', lastMessageId);
                    } else {
                        debug(`HttpBox.delete messages: `, '[]');
                        await self._showMessages('remove()', 'DELETE', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            }
        };
        // return Promise.resolve(MethodList);
        return Promise.resolve(MethodList);
    }

    /**
     * REST Client - feathers application
     * @return Promise
     */
    realTime() {
        const self = this;
        //---------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        // Connect to the `http://localhost:3030/messages` service
        const serviceMessages = app.service('messages');

        // Subscribe to the event 'created'
        app.service('messages').on('created', async message => {
            debug('Created a new message', message);
            await self._showMessages('create()', 'POST', message.id);
        });

        // Subscribe to the event 'updated'
        app.service('messages').on('updated', async message => {
            debug('Updated message', message);
            await self._showMessages('.update()', 'PUT', message.id);
        });

        // Subscribe to the event 'patched'
        app.service('messages').on('patched', async message => {
            debug('Patched message', message);
            await self._showMessages('patch()', 'PATCH', message.id);
        });

        // Subscribe to the event 'removed'
        app.service('messages').on('removed', async message => {
            debug('Deleted message', message);
            await self._showMessages('remove()', 'DELETE', message.id);
        });
        const MethodList = {
            create: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    await serviceMessages.create({text: `Client create message-${messages.length + 1}`});
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            get: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await serviceMessages.get(lastMessageId);
                        debug(`HttpBox.get message: `, message);
                        await self._showMessage('get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages('get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages('find()', 'GET');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            patch: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        await serviceMessages.patch(lastMessageId, {text: `Client patch last message-${lastMessageId}`});
                    } else {
                        debug(`HttpBox.patch messages: `, '[]');
                        await self._showMessages('patch()', 'PATCH', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            update: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        await serviceMessages.update(lastMessageId, {text: `Client put last message-${lastMessageId}`});
                    } else {
                        debug(`HttpBox.put messages: `, '[]');
                        await self._showMessages('update()', 'PUT', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            delete: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        await serviceMessages.remove(lastMessageId, {text: `Client delete last message-${lastMessageId}`});
                    } else {
                        debug(`HttpBox.delete messages: `, '[]');
                        await self._showMessages('remove()', 'DELETE', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            }
        };
        return Promise.resolve(MethodList);
    }

    // Render twig template
    /**
     * Twig render
     * @param data Object
     * @private
     */
    _twigRender(data){
        const template = require('../tmpls/service/rest-apis/messages.html.twig');
        const html = template(data);
        this.bulma.addMessage(html);
    };

    // Show messages
    async _showMessages(serviceMethod, httpMethod, id){
        // Find messages
        let messages = await this.req.get(this.urlService);
        const _url = id ? `${this.urlService}/${id}` : this.urlService;
        // Render twig template
        this._twigRender({messages, url: _url, serviceMethod, httpMethod});
    };

    // Show message
    async _showMessage(serviceMethod, httpMethod, id){
        // Find messages
        const message = await this.req.get(`${this.urlService}/${id}`);
        const _url = `${this.urlService}/${id}`;
        const messages = [message];
        // Render twig template
        this._twigRender({messages, url: _url, serviceMethod, httpMethod});
    };
}

export default Service
