"use strict";

const Base = require('./base.class');
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
        const feathers = require('@feathersjs/feathers');
        //-----------------------------------------------
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
            return todo;
        }
        return getTodo(name);
    }

    /**
     * Service methods
     * @return Promise
     */
    methods() {
        const feathers = require('@feathersjs/feathers');
        const Messages = require('./models/messages.model.class');
        //-------------------------------------------------------
        const app = feathers();
        // Initialize the messages service by creating
        // a new instance of our class
        app.use('messages', new Messages());
        async function processMessages() {
            await app.service('messages').create({
                text: 'First message'
            });
            await app.service('messages').create({
                text: 'Second message'
            });
            const messages = await app.service('messages').find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service events
     * @return Promise
     */
    events() {
        const feathers = require('@feathersjs/feathers');
        const Messages = require('./models/messages.model.class');
        //----------------------------------------------------
        const app = feathers();
        // Initialize the messages service by creating
        // a new instance of our class
        app.use('messages', new Messages());
        async function processMessages() {
            let events = [];
            app.service('messages').on('created', message => {
                events.push(`Created a new message: { id: ${message.id}, text: '${message.text}' }`);
            });
            app.service('messages').on('removed', message => {
                events.push(`Deleted message: { id: ${message.id}, text: '${message.text}' }`);
            });
            await app.service('messages').create({
                text: 'First message'
            });
            const lastMessage = await app.service('messages').create({
                text: 'Second message'
            });
            // Remove the message we just created
            await app.service('messages').remove(lastMessage.id);
            // Find available messages
            const messages = await app.service('messages').find();
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
        const feathers = require('@feathersjs/feathers');
        const Messages = require('./models/messages.model.class');
        const validate = require('./hooks/validate-messages');
        const setTimestamp = require('./hooks/set-timestamp.js');
        const self = this;
        //--------------------------------------------
        const app = feathers();
        // Add aplication hooks
        app.hooks({
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
        // Initialize the messages service by creating
        // a new instance of our class
        app.use('messages', new Messages());
        // Add "validate" and "setTimestamp" hooks for create, update, patch methods
        app.service('messages').hooks({
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
            await app.service('messages').create({
                text: text
            });
            const lastMessage = await app.service('messages').create({
                text: 'Create Second message'
            });
            await app.service('messages').patch(lastMessage.id, {
                text: 'Create and Update second message'
            });
            const messages = await app.service('messages').find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service REST APIs
     * @return Promise
     */
    async restApis() {
        const Messages = require('./models/messages.model.class');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Initialize the messages service by creating
        // a new instance of our class with CORS
        app.use('messages', new Messages());
        // Restart the server
        await this.restartServer(app);
        // Process messages service
        async function processMessages() {
            // Use the service to create a new message on the server
            await app.service('messages').create({
                text: 'Hello from the server'
            });
            await app.service('messages').create({
                text: 'First message'
            });
            await app.service('messages').create({
                text: 'Second message'
            });

            await app.service('messages').update(3, {
                text: 'Update Second message'
            });

            const messages = await app.service('messages').find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service REST Client
     * @return Promise
     */
    async restClient() {
        const Messages = require('./models/messages.model.class');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Initialize the messages service by creating
        // a new instance of our class with CORS
        app.use('messages', new Messages());
        // Restart the server
        await this.restartServer(app);
        // Process messages service
        async function processMessages() {
            // Use the service to create a new message on the server
            await app.service('messages').create({
                text: 'Hello from the server'
            });
            await app.service('messages').create({
                text: 'First message'
            });
            await app.service('messages').create({
                text: 'Second message'
            });

            await app.service('messages').update(3, {
                text: 'Update Second message'
            });
            const messages = await app.service('messages').find();
            return messages;
        }
        return processMessages();
    }

    /**
     * Service Real Time
     * @return Promise
     */
    async realTime() {
        const Messages = require('./models/messages.model.class');
        //------------------------------------------------
        // Set rest transports
        const app = this.setRestTransport();
        // Set socketio transports
        this.setSocketioTransport(app);
        // Set real time events
        this.setRealTimeEvents(app);
        // Initialize the messages service by creating
        // a new instance of our class with CORS
        app.use('messages', new Messages());
        // Restart the server
        await this.restartServer(app);
        // Process messages service
        async function processMessages() {
            // Use the service to create a new message on the server
            await app.service('messages').create({
                text: 'Hello from the server'
            });
            await app.service('messages').create({
                text: 'First message'
            });
            await app.service('messages').create({
                text: 'Second message'
            });

            await app.service('messages').update(3, {
                text: 'Update Second message'
            });
            const messages = await app.service('messages').find();
            return messages;
        }
        return processMessages();
    }
}

module.exports = Service;
