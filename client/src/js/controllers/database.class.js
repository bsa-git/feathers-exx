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
     * Action database feathers-mongodb
     * @return Promise
     */
    async featherMongoDB() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'mongodb');
    }

    /**
     * Action database feathers-elasticsearch
     * @return Promise
     */
    async featherElasticSearch() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'elasticsearch');
    }

    /**
     * Action database feathers-rethinkdb
     * @return Promise
     */
    async featherRethinkDB() {
        // Set rest transport
        const app = this.setRestTransport();
        // Service messages find
        return this._serviceMessagesFind(app, 'rethinkdb');
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
        const twigRender = (data) => {
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
            } else if (tmpl === 'mongodb') {
                template = require('../tmpls/database/feathers-mongodb/messages.html.twig');
            } else if (tmpl === 'elasticsearch') {
                template = require('../tmpls/database/feathers-elasticsearch/messages.html.twig');
            } else if (tmpl === 'rethinkdb') {
                template = require('../tmpls/database/feathers-rethinkdb/messages.html.twig');
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
            twigRender({
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
                $sort: {counter: 1},
                $limit: 2
            },
            strQuery: 'query: {$sort: {counter: 1}, limit: 2}',
            urlQuery: '$sort[counter]=1&$limit=2',
            name: '$limit',
            description: 'Will return only the number of results you specify.'
        };
        await serviceMessagesFind(context);

        // '$skip'
        context = {
            query: {
                $sort: {counter: 1},
                $limit: 2,
                $skip: 2
            },
            strQuery: 'query: {$sort: {counter: 1}, $limit: 2, $skip: 2}',
            urlQuery: '$sort[counter]=1&$limit=2&$skip=2',
            name: '$skip',
            description: 'Will skip the specified number of results.'
        };
        await serviceMessagesFind(context);

        // '$sort'
        context = {
            query: {
                $sort: {counter: -1},
                $limit: 3
            },
            strQuery: 'query: {$sort: {counter: -1}, $limit: 3}',
            urlQuery: '$sort[counter]=-1&$limit=3',
            name: '$sort',
            description: 'Will sort based on the object you provide. It can contain a list of properties by which to sort mapped to the order (1 ascending, -1 descending).'
        };
        await serviceMessagesFind(context);

        // '$select'
        context = {
            query: {
                $sort: {counter: -1},
                $limit: 3,
                $select: ['counter', 'message']
            },
            strQuery: 'query: {$sort: {counter: -1}, $limit: 3, $select: [\'counter\', \'message\']}',
            urlQuery: '$sort[counter]=-1&$limit=3&$select[]=counter&$select[]=message',
            name: '$select',
            description: 'Allows to pick which fields to include in the result. This will work for any service method.'
        };
        await serviceMessagesFind(context);

        // '$in'
        context = {
            query: {
                $sort: {counter: 1},
                counter: {$in: [2, 5]}
            },
            strQuery: 'query: {$sort: {counter: 1}, counter: {$in: [2, 5]}}',
            urlQuery: '$sort[counter]=1&counter[$in]=2&counter[$in]=5',
            name: '$in',
            description: 'Find all records where the property does ($in) or does not ($nin) match any of the given values.'
        };
        await serviceMessagesFind(context);

        // '$lt, $lte'
        context = {
            query: {
                $sort: {counter: -1},
                $limit: 3,
                counter: {$lte: 5}
            },
            strQuery: 'query: {$sort: {counter: -1}, $limit: 3, counter: {$lte: 5}}',
            urlQuery: '$sort[counter]=-1&$limit=3&counter[$lte]=5',
            name: '$lt, $lte',
            description: 'Find all records where the value is less ($lt) or less and equal ($lte) to a given value.'
        };
        await serviceMessagesFind(context);

        // '$gt, $gte'
        context = {
            query: {
                $sort: {counter: 1},
                $limit: 3,
                counter: {$gte: 5}
            },
            strQuery: 'query: {$sort: {counter: 1}, $limit: 3, counter: { $gte: 5}}',
            urlQuery: '$sort[counter]=1&$limit=3&counter[$gte]=5',
            name: '$gt, $gte',
            description: 'Find all records where the value is more ($gt) or more and equal ($gte) to a given value.'
        };
        await serviceMessagesFind(context);

        // '$ne'
        context = {
            query: {
                $sort: {counter: 1},
                $limit: 2,
                counter: {$ne: 2}
            },
            strQuery: 'query: {$sort: {counter: 1}, $limit: 2, counter: { $ne: 2}}',
            urlQuery: '$sort[counter]=1&$limit=2&counter[$ne]=2',
            name: '$ne',
            description: 'Find all records that do not equal the given property value.'
        };
        await serviceMessagesFind(context);

        // '$or'
        context = {
            query: {
                $sort: {counter: 1},
                $limit: 2,
                $or: [{counter: 1}, {counter: 3}]
            },
            strQuery: 'query: {$sort: {counter: 1}, $limit: 2, $or: [{counter: 1}, {counter: 3}]}',
            urlQuery: '$sort[counter]=1&$limit=2&$or[0][counter]=1&$or[1][counter]=3',
            name: '$or',
            description: 'Find all records that match any of the given criteria.'
        };
        await serviceMessagesFind(context);

        if (tmpl === 'knex') {
            // '$like'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$like: 'Message number 1%'}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$like: \'Message number 1%\'}}',
                urlQuery: '$sort[counter]=1&message[$like]=Message number 1%',
                name: '$like',
                description: 'Find all records where the value matches the given string pattern.'
            };
            await serviceMessagesFind(context);
        } else if (tmpl === 'elasticsearch') {
            // '$all'
            context = {
                query: {
                    $sort: {counter: 1},
                    $all: true
                },
                strQuery: 'query: {$sort: {counter: 1}, $all: true}',
                urlQuery: '$sort[counter]=1&$all=true',
                name: '$all',
                description: 'Find all documents.'
            };
            await serviceMessagesFind(context);

            // '$prefix'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$prefix: 1}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$prefix: 1}}',
                urlQuery: '$sort[counter]=1&message[$prefix]=1',
                name: '$prefix',
                description: 'Find all documents which have given field containing terms with a specified prefix (not analyzed).'
            };
            await serviceMessagesFind(context);

            // '$match'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$match: '1 3'}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$match: \'1 3\'}}',
                urlQuery: '$sort[counter]=1&message[$match]=1 3',
                name: '$match',
                description: 'Find all documents which have given given fields matching the specified value (analysed).'
            };
            await serviceMessagesFind(context);

            // '$phrase'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$phrase: '3'}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$match: \'3\'}}',
                urlQuery: '$sort[counter]=1&message[$phrase]=3',
                name: '$phrase',
                description: 'Find all documents which have given given fields matching the specified phrase (analysed).'
            };
            await serviceMessagesFind(context);

            // '$phrase_prefix'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$phrase_prefix: '1'}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$phrase_prefix: \'1\'}}',
                urlQuery: '$sort[counter]=1&message[$phrase_prefix]=1',
                name: '$phrase_prefix',
                description: 'Find all documents which have given given fields matching the specified phrase prefix (analysed).'
            };
            await serviceMessagesFind(context);

            // '$and'
            context = {
                query: {
                    $sort: {counter: 1},
                    $and: [{message: {$match: '3'}}, {counter: {$match: '3'}}]
                },
                strQuery: 'query: {$sort: {counter: 1}, $and: [{message: {$match: \'3\'}}, {counter: {$match: \'3\'}}]}',
                urlQuery: '$sort[counter]=1&$and[0]=message[$match]=3&$and[1]=counter[$match]=3',
                name: '$and',
                description: 'Find all documents which match all of the given criteria.'
            };
            await serviceMessagesFind(context);

            // '$sqs'
            context = {
                query: {
                    $sort: {counter: 1},
                    $sqs: {$fields: ['counter', 'message'], $query: '+3 +3', $operator: 'and'}
                },
                strQuery: 'query: {$sort: {counter: 1}, $sqs: {$fields: [\'counter\', \'message\'], $query: \'+3 +3\', $operator: \'and\'}}',
                urlQuery: '$sort[counter]=1&$sqs[$fields][]=counter&$sqs[$fields][]=message&$sqs[$query]=+3 +3&$sqs[$operator]=and',
                name: '$sqs',
                description: 'A query that uses the SimpleQueryParser to parse its context. Optional $operator which is set to or by default but can be set to and if required.'
            };
            await serviceMessagesFind(context);

            // Custom query for messages service
            context = {
                query: {
                    "size": 0,
                    "aggs": {"group_by_sum": {"sum": {"field": "counter"}}}
                },
                strQuery: 'query: {"size": 0, "aggs": {"group_by_sum": {"sum": {"field": "counter"}}}}',
                urlQuery: 'size=0&aggs[group_by_sum][sum][field]=counter',
                name: '#Custom query for messages service#',
                description: 'The REST API for search is accessible from the _search endpoint.'
            };
            // Connect to the service
            const queryMessages = app.service('messages-query');
            const queryResult = await queryMessages.find({query: context.query});
            twigRender({
                queryResult: {count: queryResult.hits.total, sum: queryResult.aggregations.group_by_sum.value},
                name: context.name,
                description: context.description,
                strQuery: context.strQuery,
                urlQuery: context.urlQuery
            });
        } else if (tmpl === 'rethinkdb') {
            // '$search'
            context = {
                query: {
                    $sort: {counter: 1},
                    message: {$search: '1'}
                },
                strQuery: 'query: {$sort: {counter: 1}, message: {$search: \'1\'}}',
                urlQuery: '$sort[counter]=1&message[$search]=1',
                name: '$search',
                description: 'Return all matches for a property using the <a href="https://www.rethinkdb.com/api/javascript/match/" target="_blank">RethinkDB match syntax</a>.'
            };
            await serviceMessagesFind(context);

            // '$contains'
            context = {
                query: {
                    $sort: {counter: 1},
                    tags: {$contains: '7'}
                },
                strQuery: 'query: {$sort: {counter: 1}, tags: {$contains: \'7\'}}',
                urlQuery: '$sort[counter]=1&tags[$contains]=7',
                name: '$contains',
                description: 'Matches if the property is an array that contains the given entry.'
            };
            await serviceMessagesFind(context);
        }

        return 'ok';
    }
}

export default Database
