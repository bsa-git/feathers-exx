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
    feathersMemory() {
        const self = this;
        const feathers = require('@feathersjs/feathers');
        const express = require('@feathersjs/express');
        const correctTypeQuery = require('./lib/hooks/correct-type-query');
        const memory = require('feathers-memory');
        //------------------------------------------------

        // This creates an app that is both, an Express and Feathers app
        const app = express(feathers());

        // CORS
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });

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

        // Start the server on port 3030
        // If the server exists, then we close it
        if (this.req.app.get('httpServer')) {
            this.req.app.get('httpServer').close(() => {
                if (self.config.debug) {
                    console.log(`Feathers REST API closed at http://localhost:${self.config.app.exxPort}`);
                }
                self.createServer(app);
            });
        } else {
            this.createServer(app);
        }

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
    feathersNeDB() {
        const self = this;
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

        // CORS
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        });

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

        // Start the server on port 3030
        // If the server exists, then we close it
        if (this.req.app.get('httpServer')) {
            this.req.app.get('httpServer').close(() => {
                if (self.config.debug) {
                    console.log(`Feathers REST API closed at http://localhost:${self.config.app.exxPort}`);
                }
                self.createServer(app);
            });
        } else {
            this.createServer(app);
        }

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
}

module.exports = Database;
