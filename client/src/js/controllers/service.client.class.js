"use strict";

import Base from './base.client.class'

const debug = require('debug')('app:service.controller');

class Service extends Base {
    constructor(client) {
        super(client);
        this.urlHost = `${this.req.protocol}//${this.req.hostname}:${this.data.port}`;
    }

    /**
     * startClient - our first Feathers application on client
     * @param name String
     * @return Promise
     */
    startClient(name) {
        const feathers = require('@feathersjs/client');
        const urlService = 'service/start-server/todos';
        //----------------------------------------------
        const app = feathers();
        // Register a simple todos service that return the name and a text
        app.use(urlService, {
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
            const service = app.service(urlService);
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
        const urlService = `${this.urlHost}/service/rest-apis/messages`;
        //---------------------------------
        const MethodList = {
            create: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(urlService);
                    // Create message
                    const message = await self.req.post(urlService, {text: `Client create message-${messages.length + 1}`});
                    debug(`HttpBox.post message: `, message);
                    await self._showMessages(urlService, 'create()', 'POST');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            get: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await self.req.get(`${urlService}/${lastMessageId}`);
                        debug(`HttpBox.get message: `, message);
                        await self._showMessage(urlService, 'get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages(urlService, 'get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages(urlService, 'find()', 'GET');
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            patch: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.patch(`${urlService}/${lastMessageId}`, {text: `Client patch last message-${lastMessageId}`});
                        debug(`HttpBox.patch message: `, message);
                        await self._showMessages(urlService, 'patch()', 'PATCH', lastMessageId);
                    } else {
                        debug(`HttpBox.patch messages: `, '[]');
                        await self._showMessages(urlService, 'patch()', 'PATCH', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            update: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.put(`${urlService}/${lastMessageId}`, {text: `Client put last message-${lastMessageId}`});
                        debug(`HttpBox.put message: `, message);
                        await self._showMessages(urlService, '.update()', 'PUT', lastMessageId);
                    } else {
                        debug(`HttpBox.put messages: `, '[]');
                        await self._showMessages(urlService, 'update()', 'PUT', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            delete: async () => {
                try {
                    // Find messages
                    const messages = await self.req.get(urlService);
                    if (messages.length > 0) {
                        const lastMessageId = messages[messages.length - 1].id;
                        const message = await this.req.delete(`${urlService}/${lastMessageId}`, {text: `Client delete last message-${lastMessageId}`});
                        debug(`HttpBox.delete message: `, message);
                        await self._showMessages(urlService, 'remove()', 'DELETE', lastMessageId);
                    } else {
                        debug(`HttpBox.delete messages: `, '[]');
                        await self._showMessages(urlService, 'remove()', 'DELETE', 1);
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
        const urlService = 'service/rest-client/messages';
        //---------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Connect to service
        const serviceMessages = app.service(urlService);
        const MethodList = {
            create: async () => {
                try {
                    // Find messages
                    const messages = await serviceMessages.find();
                    const message = await serviceMessages.create({text: `Client create message-${messages.length + 1}`});
                    debug(`HttpBox.post message: `, message);
                    await self._showMessages(`${self.urlHost}/${urlService}`, 'create()', 'POST');
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
                        await self._showMessage(`${self.urlHost}/${urlService}`, 'get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages(`${self.urlHost}/${urlService}`, 'find()', 'GET');
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'patch()', 'PATCH', lastMessageId);
                    } else {
                        debug(`HttpBox.patch messages: `, '[]');
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'patch()', 'PATCH', 1);
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, '.update()', 'PUT', lastMessageId);
                    } else {
                        debug(`HttpBox.put messages: `, '[]');
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'update()', 'PUT', 1);
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'remove()', 'DELETE', lastMessageId);
                    } else {
                        debug(`HttpBox.delete messages: `, '[]');
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'remove()', 'DELETE', 1);
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
        const urlService = 'service/real-time/messages';
        //---------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        // Connect to service
        const serviceMessages = app.service(urlService);

        // Subscribe to the event 'created'
        app.service(urlService).on('created', async message => {
            debug('Created a new message', message);
            await self._showMessages(`${self.urlHost}/${urlService}`, 'create()', 'POST', message.id);
        });

        // Subscribe to the event 'updated'
        app.service(urlService).on('updated', async message => {
            debug('Updated message', message);
            await self._showMessages(`${self.urlHost}/${urlService}`, '.update()', 'PUT', message.id);
        });

        // Subscribe to the event 'patched'
        app.service(urlService).on('patched', async message => {
            debug('Patched message', message);
            await self._showMessages(`${self.urlHost}/${urlService}`, 'patch()', 'PATCH', message.id);
        });

        // Subscribe to the event 'removed'
        app.service(urlService).on('removed', async message => {
            debug('Deleted message', message);
            await self._showMessages(`${self.urlHost}/${urlService}`, 'remove()', 'DELETE', message.id);
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
                        await self._showMessage(`${self.urlHost}/${urlService}`, 'get()', 'GET', lastMessageId);
                    } else {
                        debug(`HttpBox.get message: `, '[]');
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'get()', 'GET', 1);
                    }
                } catch (ex) {
                    self.bulma.showError(ex);
                }
            },
            find: async () => {
                try {
                    await self._showMessages(`${self.urlHost}/${urlService}`, 'find()', 'GET');
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'patch()', 'PATCH', 1);
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'update()', 'PUT', 1);
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
                        await self._showMessages(`${self.urlHost}/${urlService}`, 'remove()', 'DELETE', 1);
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
    _twigRender(data) {
        const template = require('../tmpls/service/rest-apis/messages.html.twig');
        const html = template(data);
        this.bulma.addMessage(html);
    };

    // Show messages
    async _showMessages(urlService, serviceMethod, httpMethod, id) {
        // Find messages
        let messages = await this.req.get(urlService);
        const _url = id ? `${urlService}/${id}` : this.urlService;
        // Render twig template
        this._twigRender({messages, url: _url, serviceMethod, httpMethod});
    };

    // Show message
    async _showMessage(urlService, serviceMethod, httpMethod, id) {
        // Find messages
        const message = await this.req.get(`${urlService}/${id}`);
        const _url = `${urlService}/${id}`;
        const messages = [message];
        // Render twig template
        this._twigRender({messages, url: _url, serviceMethod, httpMethod});
    };
}

export default Service
