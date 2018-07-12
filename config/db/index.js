"use strict";

const path = require('path');

// Global values for application"
module.exports = {
    nedb: {
        filename: path.join(__dirname, `../..${process.env.DB_NEDB_FILENAME}`),
        autoload: true
    },
    mongoose: {
        connection_string: process.env.DB_MONGOOSE_URI
    },
    mongodb: {
        connection_string: process.env.DB_MONGODB_URI
    },
    elasticsearch: {
        connection_string: process.env.DB_ELASTICSEARCH_URI,
        index: process.env.DB_ELASTICSEARCH_INDEX,
        type: process.env.DB_ELASTICSEARCH_TYPE
    },
    rethinkdb: {
        database: process.env.DB_RETHINKDB_DATABASE,
        table: process.env.DB_RETHINKDB_TABLE
    },
    knex: {
        sqlite: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, `../..${process.env.DB_KNEX_SQLITE_FILENAME}`),
            },
            useNullAsDefault: true
        },
        mysql: {
            client: 'mysql',
            connection: {
                host: process.env.DB_KNEX_MYSQL_HOST,
                user: process.env.DB_KNEX_MYSQL_USER,
                password: process.env.DB_KNEX_MYSQL_PASSWORD,
                database: process.env.DB_KNEX_MYSQL_DATABASE
            }
        },
        postgres: {
            client: 'pg',
            version: '7.2',
            connection: {
                host: process.env.DB_KNEX_POSTGRES_HOST,
                user: process.env.DB_KNEX_POSTGRES_USER,
                password: process.env.DB_KNEX_POSTGRES_PASSWORD,
                database: process.env.DB_KNEX_POSTGRES_DATABASE
            }
        }
    },
    sequelize: {
        sqlite: {
            connection_string: `sqlite:${path.join(__dirname, '../..' + process.env.DB_SEQUELIZE_SQLITE_STORAGE)}`,
            database: process.env.DB_SEQUELIZE_SQLITE_DATABASE,
            username: process.env.DB_SEQUELIZE_SQLITE_USERNAME,
            password: process.env.DB_SEQUELIZE_SQLITE_PASSWORD,
            options: {
                dialect: 'sqlite',
                storage: path.join(__dirname, `../..${process.env.DB_SEQUELIZE_SQLITE_STORAGE}`),
                logging: false
            }
        },
        mysql: {
            connection_string: process.env.DB_SEQUELIZE_MYSQL_URI,// mysql://user:pass@example.com:9821/db_name
            database: process.env.DB_SEQUELIZE_MYSQL_DATABASE,
            username: process.env.DB_SEQUELIZE_MYSQL_USERNAME,
            password: process.env.DB_SEQUELIZE_MYSQL_PASSWORD,
            options: {
                dialect: 'mysql',
                host: process.env.DB_SEQUELIZE_MYSQL_HOST,
                port: process.env.DB_SEQUELIZE_MYSQL_PORT,
                logging: false
            }
        },
        postgres: {
            connection_string: process.env.DB_SEQUELIZE_POSTGRES_URI,
            database: process.env.DB_SEQUELIZE_POSTGRES_DATABASE,
            username: process.env.DB_SEQUELIZE_POSTGRES_USERNAME,
            password: process.env.DB_SEQUELIZE_POSTGRES_PASSWORD,
            options: {
                dialect: 'postgres',
                host: process.env.DB_SEQUELIZE_POSTGRES_HOST,
                logging: false
            }
        }
    }
};
