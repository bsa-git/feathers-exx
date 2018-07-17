"use strict";

const Base = require('./base.server.class');
const debug = require('debug')('app:service.controller');

class Service extends Base {
    constructor(context) {
        super(context);
    }

    /**
     * Our first Feathers application
     * @param name String
     * @return Promise
     */
    startServer(name) {
        const self = this;
        const urlService = 'service/start-server/todos';
        //-----------------------------------------------
        // Register a simple todos service that return the name and a text
        this.app.use(urlService, {// /start-client
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
            const service = self.app.service(urlService);
            // Call the `get` method with a name
            const todo = await service.get(name);
            return todo;
        }
        return getTodo(name);
    }

    /**
     * Service methods
     * @return Promise
     */
    methods() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const urlService = 'service/methods/messages';
        //-------------------------------------------------------
        // Initialize the messages service by creating
        // a new instance of our class
        this.app.use(urlService, new Messages());
        async function processMessages() {
            await self.app.service(urlService).create({
                text: 'First message'
            });
            await self.app.service(urlService).create({
                text: 'Second message'
            });
            const messages = await self.app.service(urlService).find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service events
     * @return Promise
     */
    events() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const urlService = 'service/events/messages';
        //----------------------------------------------------
        // Initialize the messages service by creating
        // a new instance of our class
        this.app.use(urlService, new Messages());
        async function processMessages() {
            let events = [];
            self.app.service(urlService).on('created', message => {
                events.push(`Created a new message: { id: ${message.id}, text: '${message.text}' }`);
            });
            self.app.service(urlService).on('removed', message => {
                events.push(`Deleted message: { id: ${message.id}, text: '${message.text}' }`);
            });
            await self.app.service(urlService).create({
                text: 'First message'
            });
            const lastMessage = await self.app.service(urlService).create({
                text: 'Second message'
            });
            // Remove the message we just created
            await self.app.service(urlService).remove(lastMessage.id);
            // Find available messages
            const messages = await self.app.service(urlService).find();
            events.push(`Available messages: [ { id: ${messages[0].id}, text: '${messages[0].text}' } ]`);
            return events;
        }
        return processMessages();
    }

    /**
     * Hooks
     * @return Promise
     */
    hooks() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const validate = require('./hooks/validate-messages');
        const setTimestamp = require('./hooks/set-timestamp.js');
        const urlService = 'service/hooks/messages';
        //--------------------------------------------
        // Add aplication hooks
        this.app.hooks({
            before: async context => {
                debug(`Hook.before for '${context.path}' service method '${context.method}'`);
            },
            after: async context => {
                debug(`Hook.after for '${context.path}' service method '${context.method}'`);
            },
            error: async context => {
                const errMessage = `Error: '${context.error.message}';  Path: '${context.path}'; service-method: '${context.method}';`;
                console.error(errMessage);
            }
        });
        // Initialize the messages service
        // a new instance of our class
        this.app.use(urlService, new Messages());
        // Add "validate" and "setTimestamp" hooks for create, update, patch methods
        this.app.service(urlService).hooks({
            before: {
                create: [validate, setTimestamp({name: 'createdAt'})],
                update: [validate, setTimestamp({name: 'updatedAt'})],
                patch: [validate, setTimestamp({name: 'updatedAt'})]
            }
        });
        async function processMessages() {
            let text = '';

            if (self.req.params.validate === 'ok') {
                text = 'Create first message';
            } else {
                text = '';
            }
            await self.app.service(urlService).create({
                text: text
            });
            const lastMessage = await self.app.service(urlService).create({
                text: 'Create Second message'
            });
            await self.app.service(urlService).patch(lastMessage.id, {
                text: 'Create and Update second message'
            });
            const messages = await self.app.service(urlService).find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service REST APIs
     * @return Promise
     */
    async restApis() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const urlService = 'service/rest-apis/messages';
        //------------------------------------------------
        // Initialize the messages service
        this.app.use(urlService, new Messages());
        // Process messages service
        async function processMessages() {

            // Use the service to create a new message on the server
            await self.app.service(urlService).create({
                text: 'Hello from the server'
            });
            await self.app.service(urlService).create({
                text: 'First message'
            });
            await self.app.service(urlService).create({
                text: 'Second message'
            });

            await self.app.service(urlService).update(3, {
                text: 'Update Second message'
            });

            const messages = await self.app.service(urlService).find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service REST Client
     * @return Promise
     */
    async restClient() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const urlService = 'service/rest-client/messages';
        //------------------------------------------------
        // Initialize the messages service
        this.app.use(urlService, new Messages());
        // Process messages service
        async function processMessages() {
            // Use the service to create a new message on the server
            await self.app.service(urlService).create({
                text: 'Hello from the server'
            });
            await self.app.service(urlService).create({
                text: 'First message'
            });
            await self.app.service(urlService).create({
                text: 'Second message'
            });

            await self.app.service(urlService).update(3, {
                text: 'Update Second message'
            });
            const messages = await self.app.service(urlService).find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service Real Time
     * @return Promise
     */
    async realTime() {
        const self = this;
        const Messages = require('./models/messages.model.class');
        const urlService = 'service/real-time/messages';
        //------------------------------------------------
        // Initialize the messages service
        this.app.use(urlService, new Messages());
        // Process messages service
        async function processMessages() {
            // Use the service to create a new message on the server
            await self.app.service(urlService).create({
                text: 'Hello from the server'
            });
            await self.app.service(urlService).create({
                text: 'First message'
            });
            await self.app.service(urlService).create({
                text: 'Second message'
            });

            await self.app.service(urlService).update(3, {
                text: 'Update Second message'
            });
            const messages = await self.app.service(urlService).find();
            return messages;
        }
        return processMessages();
    }
}

module.exports = Service;
