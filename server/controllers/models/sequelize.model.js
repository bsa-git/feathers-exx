"use strict";

const Sequelize = require('sequelize');

module.exports = (app)=>{
    const db_current = app.get('database')['db_current'];
    const dbConfig = app.get('database')['sequelize'][db_current];
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
    return {model, sequelize};
};