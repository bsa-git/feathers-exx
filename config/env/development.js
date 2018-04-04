"use strict";

const path = require('path');

module.exports = {
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
                connection_string: 'mongodb://localhost:27017/dbFeathersExx'
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
};
