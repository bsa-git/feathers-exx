"use strict";

import Base from './base.class'

class Database extends Base {
    constructor(client) {
        super(client);
    }

    /**
     * Action database feathers-memory
     * @return Promise
     */
    async feathersMemory() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'memory');
    }

    /**
     * Action database feathers-nedb
     * @return Promise
     */
    async feathersNeDB() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'nedb');
    }

    /**
     * Action database feathers-localstorage
     * @return Promise
     */
    async feathersLocalStorage() {
        const feathers = require('@feathersjs/client');
        const service = require('feathers-localstorage');
        //---------------------------------

        const app = feathers();
        app.use('/messages', service({
            storage: window.localStorage || AsyncStorage,
            paginate: {
                default: 5,
                max: 10
            }
        }));

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

        // Show messages list from LocalStorage
        const data = {messages_1: messages_1.data, messages_2: messages_2.data};
        const template = require('../tmpls/database/feathers-localstorage/messages-1.html.twig');
        const html = template(data);
        this.bulma.addMessage(html);

        // Service messages find
        return this._serviceMessagesFind(app, 'localstorage');
    }


    /**
     * Action database feathers-knex
     * @return Promise
     */
    async feathersKnex() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'knex');
    }

    /**
     * Action database feathers-sequelize
     * @return Promise
     */
    async featherSequelize() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'sequelize');
    }

    /**
     * Action database feathers-mongoose
     * @return Promise
     */
    async featherMongoose() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'mongoose');
    }

    /**
     * Process messages find
     * @param app
     * @param tmpl
     * @return {Promise.<string>}
     * @private
     */
    async _serviceMessagesFind(app, tmpl) {
        const self = this;
        //------------------------
        // Connect to the service
        const serviceMessages = app.service('messages');
        // Render twig template
        let template;
        const _twigRender = (data) => {
            if (tmpl === 'memory') {
                template = require('../tmpls/database/feathers-memory/messages.html.twig');
            } else if (tmpl === 'nedb') {
                template = require('../tmpls/database/feathers-nedb/messages.html.twig');
            } else if (tmpl === 'localstorage') {
                template = require('../tmpls/database/feathers-localstorage/messages-2.html.twig');
            } else if (tmpl === 'knex') {
                template = require('../tmpls/database/feathers-knex/messages.html.twig');
            } else if (tmpl === 'sequelize') {
                template = require('../tmpls/database/feathers-sequelize/messages.html.twig');
            } else if (tmpl === 'mongoose') {
                template = require('../tmpls/database/feathers-mongoose/messages.html.twig');
            } else {
                template = require('../tmpls/database/feathers-memory/messages.html.twig');
            }

            const html = template(data);
            self.bulma.addMessage(html);
        };

        /**
         * Find service messages and display
         * @param context Object
         * context = {
         *  query: {query: { $limit: 2, read: false}},
         *  strQuery: '{query: { $limit: 2, read: false}}',
         *  name: '$limit',
         *  description: ' will return only the number of results you specify'
         * }
         * @return {Promise.<*>}
         */
        const serviceMessagesFind = async (context) => {
            // Find messages
            const messages = await serviceMessages.find({query: context.query});
            _twigRender({
                messages: messages.data,
                name: context.name,
                description: context.description,
                strQuery: context.strQuery,
                urlQuery: context.urlQuery
            });
            return messages;
        };

        // 'Equality'
        let context = {
            query: {
                counter: 5
            },
            strQuery: 'query: {counter: 5}',
            urlQuery: 'counter=5',
            name: 'Equality',
            description: 'All fields that do not contain special query parameters are compared directly for equality.'
        };
        await serviceMessagesFind(context);

        // '$limit'
        context = {
            query: {
                $limit: 2
            },
            strQuery: 'query: {$limit: 2}',
            urlQuery: '$limit=2',
            name: '$limit',
            description: 'Will return only the number of results you specify.'
        };
        await serviceMessagesFind(context);

        // '$skip'
        context = {
            query: {
                $limit: 2,
                $skip: 2
            },
            strQuery: 'query: {$limit: 2, $skip: 2}',
            urlQuery: '$limit=2&$skip=2',
            name: '$skip',
            description: 'Will skip the specified number of results.'
        };
        await serviceMessagesFind(context);

        // '$sort'
        context = {
            query: {
                $limit: 3,
                $sort: {counter: -1}
            },
            strQuery: 'query: {$limit: 3, $sort: {counter: -1}}',
            urlQuery: '$limit=3&sort[counter]=-1',
            name: '$sort',
            description: 'Will sort based on the object you provide. It can contain a list of properties by which to sort mapped to the order (1 ascending, -1 descending).'
        };
        await serviceMessagesFind(context);

        // '$select'
        context = {
            query: {
                $limit: 3,
                $sort: {counter: -1},
                $select: ['message']
            },
            strQuery: 'query: {$limit: 3, $sort: {counter: -1}, $select: [\'message\']}',
            urlQuery: '$limit=3&sort[counter]=-1&$select[]=message',
            name: '$select',
            description: 'Allows to pick which fields to include in the result. This will work for any service method.'
        };
        await serviceMessagesFind(context);

        // '$in'
        context = {
            query: {
                counter: {$in: [2, 5]}
            },
            strQuery: 'query: {counter: {$in: [2, 5]}}',
            urlQuery: 'counter[$in]=2&counter[$in]=5',
            name: '$in',
            description: 'Find all records where the property does ($in) or does not ($nin) match any of the given values.'
        };
        await serviceMessagesFind(context);

        // '$lt, $lte'
        context = {
            query: {
                $limit: 3,
                $sort: {counter: -1},
                counter: {$lte: 5}
            },
            strQuery: 'query: {$limit: 3, $sort: {counter: -1}, counter: {$lte: 5}}',
            urlQuery: '$limit=3&sort[counter]=-1&counter[$lte]=5',
            name: '$lt, $lte',
            description: 'Find all records where the value is less ($lt) or less and equal ($lte) to a given value.'
        };
        await serviceMessagesFind(context);

        // '$gt, $gte'
        context = {
            query: {
                $limit: 3,
                counter: {$gte: 5}
            },
            strQuery: 'query: {$limit: 3, counter: { $gte: 5}}',
            urlQuery: '$limit=3&counter[$gte]=5',
            name: '$gt, $gte',
            description: 'Find all records where the value is more ($gt) or more and equal ($gte) to a given value.'
        };
        await serviceMessagesFind(context);

        // '$ne'
        context = {
            query: {
                $limit: 2,
                counter: {$ne: 2}
            },
            strQuery: 'query: {$limit: 2, counter: { $ne: 2}}',
            urlQuery: '$limit=2&counter[$ne]=2',
            name: '$ne',
            description: 'Find all records that do not equal the given property value.'
        };
        await serviceMessagesFind(context);

        // '$or'
        context = {
            query: {
                $limit: 2,
                $or: [{counter: 1}, {counter: 3}]
            },
            strQuery: 'query: {$limit: 2, $or: [{counter: 1}, {counter: 3}]}',
            urlQuery: '$limit=2&$or[0][counter]=1&$or[1][counter]=3',
            name: '$or',
            description: 'Find all records that match any of the given criteria.'
        };
        await serviceMessagesFind(context);

        if (tmpl === 'knex') {
            // '$like'
            context = {
                query: {
                    message: {$like: 'Message number 1%'}
                },
                strQuery: 'query: {message: {$like: \'Message number 1%\'}}',
                urlQuery: 'message[$like]=Message number 1%',
                name: '$like',
                description: 'Find all records where the value matches the given string pattern.'
            };
            await serviceMessagesFind(context);
        } else if (tmpl === 'nedb') {

        }

        return 'ok';
    }
}

export default Database
