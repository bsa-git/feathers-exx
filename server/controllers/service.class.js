"use strict";

const Base = require('./base.class');

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
        //------------------
        const feathers = require('@feathersjs/feathers');
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
        const Messages = require('./lib/services/messages.class');

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
        const Messages = require('./lib/services/messages.class');

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
        const Messages = require('./lib/services/messages.class');
        const validate = require('./lib/hooks/validate-messages');
        const setTimestamp = require('./lib/hooks/set-timestamp.js');
        const self = this;
        //--------------------------------------------

        const app = feathers();

        // Add aplication hooks
        app.hooks({
            before: async context => {
                if (self.config) {
                    console.log(`Hook.before for '${context.path}' service method '${context.method}'`);
                }
            },
            after: async context => {
                if (self.config) {
                    console.log(`Hook.after for '${context.path}' service method '${context.method}'`);
                }
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
    restApis() {
        const self = this;
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const Messages = require('./lib/services/messages.class');
        //------------------------------------------------



        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());

        // CORS
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });

        // Initialize the messages service by creating
        // a new instance of our class with CORS
        app.use('messages', new Messages());

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Start the server on port 3030
        // If the server exists, then we close it
        if(this.req.app.get('httpServer')){
            this.req.app.get('httpServer').close(()=>{
                if(self.config.debug){
                    console.log(`Feathers REST API closed at http://localhost:${self.config.app.exxPort}`);
                }
                self.createServer(app);
            });
        }else {
            this.createServer(app);
        }

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
    restClient() {
        const self = this;
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const Messages = require('./lib/services/messages.class');
        //------------------------------------------------



        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());

        // CORS
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });

        // Initialize the messages service by creating
        // a new instance of our class with CORS
        app.use('messages', new Messages());

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Start the server on port 3030
        // If the server exists, then we close it
        if(this.req.app.get('httpServer')){
            this.req.app.get('httpServer').close(()=>{
                if(self.config.debug){
                    console.log(`Feathers REST API closed at http://localhost:${self.config.app.exxPort}`);
                }
                self.createServer(app);
            });
        }else {
            this.createServer(app);
        }

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
