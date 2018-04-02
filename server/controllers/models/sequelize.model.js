"use strict";

const config = require('../../../config/env');
const Sequelize = require('sequelize');
//---------------------------------------

// Create Model
const dbCurrent = config.api.database.current;
const dbConfig = config.api.database.sequelize[dbCurrent];
// Set Messages model
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);
const model = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    counter: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    freezeTableName: true
});

module.exports = {model, sequelize};