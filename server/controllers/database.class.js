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
        const correctTypeQuery = require('./hooks/correct-type-query');
        const memory = require('feathers-memory');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
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
        // Restart the server
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
        const correctTypeQueryHook = require('./hooks/correct-type-query');
        const countMessagesHook = require('./hooks/feathers-nedb/count-rows.hook');
        const service = require('feathers-nedb');
        const model = require('./models/nedb.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Connect to the db, create and register a Feathers service.
        app.use('/messages', service({
            Model: model,
            paginate: {
                default: 5,
                max: 10
            }
        }));// count-rows.hook.js
        // Register 'count-rows' service
        app.use('count-rows', service({
            Model: model
        }));
        // Add "correctTypeQueryHook" for find method
        app.service('messages').hooks({
            before: {
                find: [correctTypeQueryHook({_id: 'int', counter: 'int'})]
            }
        });
        // Add "countMessagesHook" for find method
        app.service('count-rows').hooks({
            before: {
                find: [countMessagesHook]
            }
        });
        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const countMessages = app.service('count-rows');
            // If there are messages, then we do not create new ones
            const _msessages = await messages.find();
            if (parseInt(_msessages.total) === 0) {
                for (let counter = 1; counter <= 10; counter++) {
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`
                    });
                }
                // Create an index
                await model.ensureIndex({ fieldName: 'counter' });
                console.log('Created an index for \'counter\' field name.');
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

            const numberMessages = await countMessages.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, numberMessages};
        }

        return processMessages(app);
    }

    /**
     * Feathers Knex database
     * @return Promise
     */
    async feathersKnex() {
        const appHooks = require('./hooks/feathers-knex/app.hooks');
        const sumCounterHook = require('./hooks/feathers-knex/sum-counter.hook');
        const service = require('feathers-knex');
        const model = require('./models/knex.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Create 'messages' service
        app.use('/messages', service({
            Model: model,
            name: 'messages',
            paginate: {
                default: 5,
                max: 10
            }
        }));
        // Create 'sum-counter' service
        app.use('sum-counter', service({
            Model: model,
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
        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const sumCounter = app.service('sum-counter');
            // Clean up our data.
            await model.schema.dropTableIfExists('messages');
            console.log('Dropped messages table');
            // Create 'messages' table
            await model.schema.createTable('messages', table => {
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
        const sumCounterHook = require('./hooks/feathers-sequelize/sum-counter.hook');
        const service = require('feathers-sequelize');
        const {model, sequelize} = require('./models/sequelize.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Save sequelize as 'sequelizeClient'
        app.set('sequelizeClient', sequelize);
        // Test the connection
        await sequelize.authenticate();
        // Create Sequelize Feathers service
        app.use('/messages', service({
            Model: model,
            paginate: {
                default: 5,
                max: 10
            }
        }));
        // Create 'sum-counter' service
        app.use('sum-counter', service({
            Model: model
        }));
        // Add "sumCounterHook" hooks for find methods
        app.service('sum-counter').hooks({
            before: {
                find: [sumCounterHook]
            }
        });
        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const sumCounter = app.service('sum-counter');
            // force: true will drop the table if it already exists
            await model.sync({force: true});
            console.log('Dropped messages table');
            // Create a dummy messages
            for (let counter = 1; counter <= 10; counter++) {
                await model.create({
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
            const counters = await sumCounter.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, counters: counters[0].sum_counter};
        }

        return processMessages(app);
    }

    /**
     * Feathers Mongoose database
     * @return Promise
     */
    async feathersMongoose() {
        const correctTypeQueryHook = require('./hooks/correct-type-query');
        const countMessagesHook = require('./hooks/feathers-nedb/count-rows.hook');
        const service = require('feathers-nedb');
        const model = require('./models/nedb.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();
        // Connect to the db, create and register a Feathers service.
        app.use('/messages', service({
            Model: model,
            paginate: {
                default: 5,
                max: 10
            }
        }));// count-rows.hook.js
        // Register 'count-rows' service
        app.use('count-rows', service({
            Model: model
        }));
        // Add "correctTypeQueryHook" for find method
        app.service('messages').hooks({
            before: {
                find: [correctTypeQueryHook({_id: 'int', counter: 'int'})]
            }
        });
        // Add "countMessagesHook" for find method
        app.service('count-rows').hooks({
            before: {
                find: [countMessagesHook]
            }
        });
        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const countMessages = app.service('count-rows');
            // If there are messages, then we do not create new ones
            const _msessages = await messages.find();
            if (parseInt(_msessages.total) === 0) {
                for (let counter = 1; counter <= 10; counter++) {
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`
                    });
                }
                // Create an index
                await model.ensureIndex({ fieldName: 'counter' });
                console.log('Created an index for \'counter\' field name.');
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

            const numberMessages = await countMessages.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, numberMessages};
        }

        return processMessages(app);
    }
}

module.exports = Database;
