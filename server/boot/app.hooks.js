// Application hooks that run for every service
const logger = require('../hooks/logger');

const hooks = {
    before: {
        all: [logger()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [logger()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [logger()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};

module.exports = function (app) {
    app.hooks(hooks);
};
