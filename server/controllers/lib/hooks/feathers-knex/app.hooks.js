"use strict";

// A common hooks file
const { hooks } = require('feathers-knex');
const correctTypeQuery = require('../correct-type-query');


const { transaction } = hooks;

module.exports = {
    before: {
        all: [ transaction.start() ],
        find: [correctTypeQuery({id: 'int', counter: 'int'})],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [ transaction.end() ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [ transaction.rollback() ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};