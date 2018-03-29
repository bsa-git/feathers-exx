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

        const db = new NeDB(this.config.api.database.nedb);

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
        const sumCounterHook = require('./lib/hooks/feathers-knex/sum-counter.hook');
        const service = require('feathers-knex');
        const knex = require('knex');
        //------------------------------------------------

        const dbCurrent = this.config.api.database.current;
        const db = knex(this.config.api.database.knex[dbCurrent]);

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

        // Create Knex Feathers '/messages' service
        app.use('/messages', service({
            Model: db,
            name: 'messages',
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Create Knex Feathers 'sum-counter' service
        app.use('sum-counter', service({
            Model: db,
            name: 'messages'
        }));

        // Add "sumCounterHook" hooks for find methods
        app.service('sum-counter').hooks({
            before: {
                find: [sumCounterHook]
            }
        });

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
            const sumCounter = app.service('sum-counter');

            // Clean up our data.
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
            console.log('Created messages table.');
            // }
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
            const counters = await sumCounter.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, counters: counters[0].sum_counter};
        }
        return processMessages(app);
    }

    /**
     * Feathers Sequelize database
     * @return Promise
     */
    async feathersSequelize() {
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const Sequelize = require('sequelize');
        const service = require('feathers-sequelize');
        //------------------------------------------------
        const dbCurrent = this.config.api.database.current;
        const dbConfig = this.config.api.database.sequelize[dbCurrent];
        // Set Messages model
        const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);
        const Messages = sequelize.define('messages', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            counter: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false
            },
            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        }, {
            freezeTableName: true
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

        // Create Sequelize Feathers service
        app.use('/messages', service({
            Model: Messages,
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add appHooks
        // app.hooks(appHooks);

        // Set up an error handler that gives us nicer errors
        app.use(express.errorHandler());

        // Restart the server on port 3030
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            // force: true will drop the table if it already exists
            await Messages.sync({force: true});
            console.log('Dropped messages table');
            // Create a dummy messages
            for (let counter = 1; counter <= 10; counter++) {
                await Messages.create({
                    counter,
                    message: `Message number ${counter}`
                });
            }
            console.log('Created messages.');
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
