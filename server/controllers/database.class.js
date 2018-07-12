"use strict";

const path = require('path');
const Base = require('./base.class');
const debug = require('debug')('app:database.controller');

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
        const countMessagesHook = require('./hooks/feathers-nedb/count-messages.hook');
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
        }));
        // Add "correctTypeQueryHook" for find method
        app.service('messages').hooks({
            before: {
                find: [correctTypeQueryHook({counter: 'int'})]
            }
        });
        // Register 'count-messages' service
        app.use('count-messages', service({
            Model: model
        }));
        // Add "countMessagesHook" for find method
        app.service('count-messages').hooks({
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
            const countMessages = app.service('count-messages');
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
                await model.ensureIndex({fieldName: 'counter'});
                debug('Created an index for \'counter\' field name.');
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
            debug('Dropped messages table');
            // Create 'messages' table
            await model.schema.createTable('messages', table => {
                debug('Creating messages table');
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
            debug('Created messages table.');

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
            debug('Dropped messages table');
            // Create a dummy messages
            for (let counter = 1; counter <= 10; counter++) {
                await model.create({
                    counter,
                    message: `Message number ${counter}`
                });
            }
            debug('Created messages.');
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
        const serviceHooks = require('./hooks/feathers-mongoose/service.hooks');
        const countMessagesHook = require('./hooks/feathers-mongoose/count-messages.hook');
        const mongoose = require('mongoose');
        const service = require('feathers-mongoose');
        const Model = require('./models/mongoose.model');
        const config = require('../../config/db');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        mongoose.Promise = global.Promise;

        // Connect to your MongoDB instance(s)
        mongoose.connect(config.mongoose.connection_string);

        // Connect to the db, create and register a Feathers service.
        app.use('/messages', service({
            Model,
            lean: true, // set to false if you want Mongoose documents returned
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add "serviceHooks" for service
        app.service('messages').hooks(serviceHooks);

        // Register 'count-message' service
        app.use('count-messages', service({
            Model
        }));

        // Add "countMessagesHook" for find method
        app.service('count-messages').hooks({
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
            const countMessages = app.service('count-messages');

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

            const numberMessages = await countMessages.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, numberMessages};
        }

        return processMessages(app);
    }

    /**
     * Feathers MongoDB database
     * @return Promise
     */
    async feathersMongoDB() {
        const correctTypeQueryHook = require('./hooks/correct-type-query');
        const mongodbOptions = require('./hooks/feathers-mongodb/mongodb-options.hook');
        const countMessagesHook = require('./hooks/feathers-mongodb/count-messages.hook');
        const service = require('feathers-mongodb');
        const getModel = require('./models/mongodb.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        // Connect to the db, create and register a Feathers service.
        const Model = await getModel();
        app.use('/messages', service({
            Model,
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Add "serviceHooks" for service
        app.service('messages').hooks({
            before: {
                find: [correctTypeQueryHook({_id: 'ObjectID', counter: 'int'})],
                create: [mongodbOptions],
                update: [mongodbOptions],
                patch: [mongodbOptions]
            }
        });

        // Register 'count-message' service
        app.use('count-messages', service({
            Model
        }));

        // Add "countMessagesHook" for find method
        app.service('count-messages').hooks({
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
            const countMessages = app.service('count-messages');

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

            const numberMessages = await countMessages.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, numberMessages};
        }

        return processMessages(app);
    }

    /**
     * Feathers ElasticSearch database
     * @return Promise
     */
    async feathersElasticSearch() {
        const Utils = require('../../plugins/utils.class');
        const service = require('feathers-elasticsearch');
        const Messages = require('./models/elasticsearch.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        // Connect to the db, create and register a Feathers service.
        const messages = new Messages();
        const {Model, elasticsearch} = await messages.getModel();
        app.use('/messages', service({
            Model,
            elasticsearch,
            paginate: {
                default: 5,
                max: 10
            }
        }));

        // Connect to the db, create and register a Feathers service.
        app.use('/messages-query', messages);

        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const queryMessages = app.service('messages-query');

            // If there are messages, then we do not create new ones
            const _messages = await messages.find();
            const total = parseInt(_messages.total);
            if (total >= 0 && total < 10) {
                for (let counter = total + 1; counter <= 10; counter++) {
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`
                    });
                }
                // Delay time 1 sec
                await Utils.delayTime(1);
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
            const queryResult = await queryMessages.find({type: 'aggs-count-sum'});
            return {messages_1: messages_1.data, messages_2: messages_2.data, queryResult};
        }

        return processMessages(app);
    }

    /**
     * Feathers RethinkDB database
     * @return Promise
     */
    async feathersRethinkDB() {
        const correctTypeQueryHook = require('./hooks/correct-type-query');
        const distanceBetweenTwoPointsHook = require('./hooks/feathers-rethinkdb/distance-between-two-points.hook');
        const filterMessagesHook = require('./hooks/feathers-rethinkdb/filter-messages.hook');
        const service = require('feathers-rethinkdb');
        const {model, table} = require('./models/rethinkdb.model');
        //------------------------------------------------
        // Set rest transport
        const app = this.setRestTransport();

        // Register the service
       const messages = service({
           Model: model,
           name: table,
           paginate: {
               default: 5,
               max: 10
           }
       });
        app.use('messages', messages);

        // Add hook for service
        app.service('messages').hooks({
            before: {
                find: [correctTypeQueryHook({counter: 'int'})],
            }
        });

        // Connect to the db, create and register a Feathers service.
        app.use('/distance-between-two-points', messages);
        // Add hook for service
        app.service('distance-between-two-points').hooks({
            before: {
                find: [distanceBetweenTwoPointsHook],
            }
        });

        // Connect to the db, create and register a Feathers service.
        app.use('/filter-messages', messages);
        // Add hook for service
        app.service('filter-messages').hooks({
            before: {
                find: [filterMessagesHook],
            }
        });

        // Restart the server
        await this.restartServer(app);

        // Process messages service
        async function processMessages(app) {
            // Stores a reference to the messages service so we don't have to call it all the time
            const messages = app.service('messages');
            const distanceBetweenTwoPoints = app.service('distance-between-two-points');
            const filterMessages = app.service('filter-messages');

            // Initialize database and messages table if it does not exists yet
            await messages.init();

            // If there are messages, then we do not create new ones
            const _messages = await messages.find();
            const total = parseInt(_messages.total);
            if (total >= 0 && total < 10) {
                const tags = [];
                for (let counter = total + 1; counter <= 10; counter++) {
                    tags.push(`${counter}`);
                    await messages.create({
                        counter,
                        message: `Message number ${counter}`,
                        tags
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
            const distance = await distanceBetweenTwoPoints.find();
            const findFilterMessages = await filterMessages.find();
            return {messages_1: messages_1.data, messages_2: messages_2.data, distance, count: findFilterMessages.data.length};
        }
        return processMessages(app);
    }
}

module.exports = Database;
