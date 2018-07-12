"use strict";

// Config for application"
module.exports = {
    maintenance:false,
    color_theme: 'darkly', // default(Bulma as-is); cerulean(A calm blue sky); darkly(Flatly in night-mode)
    pagination_total: 6,
    controllers: [
        {'icon': 'fa-cog', 'name': 'service', 'value': 'Services'},
        {'icon': 'fa-key', 'name': 'auth', 'value': 'Authentication'},
        {'icon': 'fa-database', 'name': 'database', 'value': 'Database'}
    ],
    actions: {
        'service': [
            {'name': 'about', 'url': '/service/about', 'value': 'About'},
            {'name': 'start-server', 'url': '/service/start-server', 'value': 'Getting Started on the server'},
            {'name': 'start-client', 'url': '/service/start-client', 'value': 'Getting Started on the client'},
            {'name': 'methods', 'url': '/service/methods', 'value': 'Methods'},
            {'name': 'events', 'url': '/service/events', 'value': 'Events'},
            {'name': 'hooks', 'url': '/service/hooks/ok', 'value': 'Hooks'},
            {'name': 'rest-apis', 'url': '/service/rest-apis', 'value': 'REST APIs'},
            {'name': 'rest-client', 'url': '/service/rest-client', 'value': 'REST Client'},
            {'name': 'real-time', 'url': '/service/real-time', 'value': 'Real-time APIs'}
        ],
        'auth': [
            {'name': 'about', 'url': '/auth/about', 'value': 'About'},
            {'name': 'server', 'url': '/auth/server', 'value': 'Server'},
            {'name': 'client', 'url': '/auth/client', 'value': 'Client'},
            {'name': 'local', 'url': '/auth/local', 'value': 'Local'},
            {'name': 'jwt', 'url': '/auth/jwt', 'value': 'JWT'},
            {'name': 'oauth1', 'url': '/auth/oauth1', 'value': 'OAuth1'},
            {'name': 'oauth2', 'url': '/auth/oauth2', 'value': 'OAuth1'}
        ],
        'database': [
            {'name': 'about', 'url': '/database/about', 'value': 'About'},
            {
                'name': 'feathers-localstorage',
                'url': '/database/feathers-localstorage',
                'value': 'Feathers LocalStorage'
            },
            {'name': 'feathers-memory', 'url': '/database/feathers-memory', 'value': 'Feathers Memory'},
            {'name': 'feathers-nedb', 'url': '/database/feathers-nedb', 'value': 'Feathers NeDB'},
            {'name': 'feathers-knex', 'url': '/database/feathers-knex', 'value': 'Feathers Knex'},
            {'name': 'feathers-sequelize', 'url': '/database/feathers-sequelize', 'value': 'Feathers Sequelize'},
            {'name': 'feathers-mongoose', 'url': '/database/feathers-mongoose', 'value': 'Feathers Mongoose'},
            {'name': 'feathers-mongodb', 'url': '/database/feathers-mongodb', 'value': 'Feathers MongoDB'},
            {
                'name': 'feathers-elasticsearch',
                'url': '/database/feathers-elasticsearch',
                'value': 'Feathers ElasticSearch'
            },
            {'name': 'feathers-rethinkdb', 'url': '/database/feathers-rethinkdb', 'value': 'Feathers RethinkDB'}
        ]
    }
};
