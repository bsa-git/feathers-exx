"use strict";

const path = require('path');
const Base = require('./base.class');

class Database extends Base {

    constructor(context) {
        super(context);
    }

    /**
     * Feathers memory database
     * @return Promise
     */
    async feathersMemory() {
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const correctTypeQuery = require('./lib/hooks/correct-type-query');
        const memory = require('feathers-memory');
        //------------------------------------------------

        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // CORS Middleware
        this.corsMiddleware(app);

        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());

        // Initialize the messages service by creating
        // a new instance of our class with CORS
        // app.use('messages', new Messages());
        // Initialize the messages service
        app.use('messages', memory({
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add "correctTypeQuery" hooks for find methods
        app.service('messages').hooks({
            before: {
                find: [correctTypeQuery({id: 'int', counter: 'int'})]
            }
        });

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Restart the server on port 3030
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');

            for (let counter = 1; counter <= 10; counter++) {
                await messages.create({
                    counter,
                    message: `Message number ${counter}`
                });
            }

            const messages_1 = await messages.find({
                query: {
                    $limit: 3,
                    $sort: {counter: 1}
                }
            });

            const messages_2 = await messages.find({
                query: {
                    $limit: 1,
                    $sort: {counter: -1}
                }

            });

            return {messages_1: messages_1.data, messages_2: messages_2.data};
        }

        return processMessages(app);
    }

    /**
     * Feathers NeDB database
     * @return Promise
     */
    async feathersNeDB() {
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const correctTypeQuery = require('./lib/hooks/correct-type-query');
        const NeDB = require('nedb');
        const service = require('feathers-nedb');
        //------------------------------------------------

        const db = new NeDB({
            filename: path.join(__dirname, '../data/db/nedb/messages.db'),
            autoload: true
        });

        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // CORS Middleware
        this.corsMiddleware(app);

        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());

        // Connect to the db, create and register a Feathers service.
        app.use('/messages', service({
            Model: db,
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add "correctTypeQuery" hooks for find methods
        app.service('messages').hooks({
            before: {
                find: [correctTypeQuery({_id: 'int', counter: 'int'})]
            }
        });

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Restart the server on port 3030
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');

            // If there are messages, then we do not create new ones
            const _msessages = await messages.find();
            if (parseInt(_msessages.total) === 0) {
                for (let counter = 1; counter <= 10; counter++) {
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`
                    });
                }
            }
            const messages_1 = await messages.find({
                query: {
                    $limit: 3,
                    $sort: {counter: 1}
                }
            });

            const messages_2 = await messages.find({
                query: {
                    $limit: 1,
                    $sort: {counter: -1}
                }

            });

            return {messages_1: messages_1.data, messages_2: messages_2.data};
        }

        return processMessages(app);
    }

    /**
     * Feathers Knex database
     * @return Promise
     */
    async feathersKnex() {
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const appHooks = require('./lib/hooks/feathers-knex/app.hooks');
        const service = require('feathers-knex');
        const knex = require('knex');
        //------------------------------------------------

        const db = knex({
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '../data/db/sqlite3/messages.db'),
            },
            useNullAsDefault: true
        });

        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // CORS Middleware
        this.corsMiddleware(app);

        // Turn on JSON body parsing for REST services
        app.use(express.json());
        // Turn on URL-encoded body parsing for REST services
        app.use(express.urlencoded({extended: true}));
        // Set up REST transport using Express
        app.configure(express.rest());

        // Create Knex Feathers service
        app.use('/messages', service({
            Model: db,
            name: 'messages',
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add appHooks
        app.hooks(appHooks);

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Restart the server on port 3030
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');

            // If there are messages, then we do not create new ones
            const _msessages = await messages.find();
            if (parseInt(_msessages.total) === 0) {
                // Clean up our data. This is optional and is here because of our integration tests
                await db.schema.dropTableIfExists('messages');
                console.log('Dropped messages table');
                // Create 'messages' table
                await db.schema.createTable('messages', table => {
                    console.log('Creating messages table');
                    table.increments('id');
                    table.integer('counter');
                    table.string('message');
                });
                // Create a dummy messages
                for (let counter = 1; counter <= 10; counter++) {
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`
                    });
                }
                console.log('Created messages.');
            }

            const messages_1 = await messages.find({
                query: {
                    $limit: 3,
                    $sort: {counter: 1}
                }
            });

            const messages_2 = await messages.find({
                query: {
                    $limit: 1,
                    $sort: {counter: -1}
                }

            });

            return {messages_1: messages_1.data, messages_2: messages_2.data};
        }

        return processMessages(app);
    }
}

module.exports = Database;
