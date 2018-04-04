"use strict";

const path = require('path');

// Global values for application"
module.exports = {
    debug: false,
    maintenance: false,
    ui: {
        color_theme: 'default', // default(Bulma as-is); cerulean(A calm blue sky); darkly(Flatly in night-mode)
    },
    app: {
        controllers: [
            {'icon':'fa-cog', 'name':'service', 'value': 'Services'},
            {'icon':'fa-key', 'name':'auth', 'value': 'Authentication'},
            {'icon':'fa-database', 'name':'database', 'value': 'Database'}
        ],
        actions: {
            'service': [
                {'name':'about', 'url': '/service/about', 'value': 'About'},
                {'name':'start-server', 'url': '/service/start-server', 'value': 'Getting Started on the server'},
                {'name':'start-client', 'url': '/service/start-client', 'value': 'Getting Started on the client'},
                {'name':'methods', 'url': '/service/methods', 'value': 'Methods'},
                {'name':'events', 'url': '/service/events', 'value': 'Events'},
                {'name':'hooks', 'url': '/service/hooks/ok', 'value': 'Hooks'},
                {'name':'rest-apis', 'url': '/service/rest-apis', 'value': 'REST APIs'},
                {'name':'rest-client', 'url': '/service/rest-client', 'value': 'REST Client'},
                {'name':'real-time', 'url': '/service/real-time', 'value': 'Real-time APIs'}
            ],
            'auth': [
                {'name':'about', 'url': '/auth/about', 'value': 'About'},
                {'name':'server', 'url': '/auth/server', 'value': 'Server'},
                {'name':'client', 'url': '/auth/client', 'value': 'Client'},
                {'name':'local', 'url': '/auth/local', 'value': 'Local'},
                {'name':'jwt', 'url': '/auth/jwt', 'value': 'JWT'},
                {'name':'oauth1', 'url': '/auth/oauth1', 'value': 'OAuth1'},
                {'name':'oauth2', 'url': '/auth/oauth2', 'value': 'OAuth1'}
            ],
            'database': [
                {'name':'about', 'url': '/database/about', 'value': 'About'},
                {'name':'feathers-localstorage', 'url': '/database/feathers-localstorage', 'value': 'Feathers LocalStorage'},
                {'name':'feathers-memory', 'url': '/database/feathers-memory', 'value': 'Feathers Memory'},
                {'name':'feathers-nedb', 'url': '/database/feathers-nedb', 'value': 'Feathers NeDB'},
                {'name':'feathers-knex', 'url': '/database/feathers-knex', 'value': 'Feathers Knex'},
                {'name':'feathers-sequelize', 'url': '/database/feathers-sequelize', 'value': 'Feathers Sequelize'},
                {'name':'feathers-mongoose', 'url': '/database/feathers-mongoose', 'value': 'Feathers Mongoose'}
            ]
        }
    },
    api: {
        appPort: 3000,
        exxPort: 3030,
        base_url: 'http://localhost',
        database: {
            current: 'sqlite',// 'sqlite', 'mysql', 'postgres', 'mssql'
            nedb: {
                filename: path.join(__dirname, '../../server/data/db/nedb/messages.db'),
                autoload: true
            },
            mongoose: {
                connection_string: 'mongodb://localhost:27017/messages'
            },
            knex:{
                sqlite: {
                    client: 'sqlite3',
                    connection: {
                        filename: path.join(__dirname, '../../server/data/db/sqlite3/messages.db'),
                    },
                    useNullAsDefault: true
                },
                mysql:{
                    client: 'mysql',
                    connection: {
                        host : 'localhost',
                        user : 'root',
                        password : '',
                        database : 'dbFeathersExx'
                    }
                },
                postgres:{
                    client: 'pg',
                    version: '7.2',
                    connection: {
                        host : 'localhost',
                        user : 'your_database_user',
                        password : 'your_database_password',
                        database : 'myapp_test'
                    }
                }
            },
            sequelize: {
                sqlite: {
                    database: 'messages',
                    username: '',
                    password: '',
                    connection_string: `sqlite:${path.join(__dirname, '../../server/data/db/sqlite3/messages.db')}`,
                    options:{
                        dialect: 'sqlite',
                        storage: path.join(__dirname, '../../server/data/db/sqlite3/messages.db'),
                        logging: false
                    }
                },
                mysql:{
                    database: 'dbFeathersExx',
                    username: 'root',
                    password: '',
                    connection_string: 'mysql://root@localhost:3306/dbFeathersExx',// mysql://user:pass@example.com:9821/db_name
                    options:{
                        dialect: 'mysql',
                        host: 'localhost',
                        port: 3306,
                        logging: false
                    }
                },
                postgres:{
                    database: 'myapp_test',
                    username: 'your_database_user',
                    password: 'your_database_password',
                    connection_string: 'postgres://user:pass@example.com:5432/dbname',
                    options:{
                        dialect: 'postgres',
                        host: 'localhost',
                        logging: false
                    }
                }
            }
        }
    },
    personal_data: {
        app_title: 'Feathers examples',
        logo_title: 'BSA Lab.',
        logo_icon: 'fa-address-card',
        logo_img: '/images/bsa-logo/4_bsa-logo_229x75.png',
        copyright: '© 2017 BSA Lab.',
        designed_with: 'BSA Lab.',
        designed_with_url: 'http://bsa-git.github.io/',
        contact: {
            fullName: 'Sergey Beskorovainny',
            givenName: 'Sergey',
            familyName: 'Beskorovainny',
            emailPersonal: 'bsa2657@yandex.ru',
            emailWork: 'm5-asutp@azot.ck.ua',
            website: 'http://bsa-git.github.io/'
        },
        twitter: {url: 'https://twitter.com/bsa2657', tag: '@bsa2657'},
        socials: {
            facebook: {url: 'https://www.facebook.com/profile.php?id=100010324420196', icon: 'fa-facebook'},
            twitter: {url: 'https://twitter.com/bsa2657', icon: 'fa-twitter'},
            google: {url: 'https://plus.google.com/110341449488589699610?rel=author', icon: 'fa-google-plus'}
        }
    },
    pagination:{
        total: 6
    }
}
