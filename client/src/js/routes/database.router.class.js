"use strict";

import Database from '../controllers/database.class'

/**
 * Database router
 */
class DatabaseRouter {
    constructor(client) {
        this.client = client;
        this.database = new Database(client);
    }

    /**
     * Route database feathers-memory
     * @return Promise
     */
    async routeFeathersMemory() {
        // Run feathersMemory action
        await this.database.feathersMemory();
        return 'ok';
    }

    /**
     * Route database feathers-nedb
     * @return Promise
     */
    async routeFeathersNeDB() {
        // Run feathersNeDB action
        await this.database.feathersNeDB();
        return 'ok';
    }

    /**
     * Route database feathers-localstorage
     * @return Promise
     */
    async routeFeathersLocalStorage() {
        await this.database.feathersLocalStorage();
        return 'ok';
    }

    /**
     * Route database feathers-knex
     * @return Promise
     */
    async routeFeathersKnex() {
        await this.database.feathersKnex();
        return 'ok';
    }

    /**
     * Route database feathers-sequelize
     * @return Promise
     */
    async routeFeathersSequelize() {
        await this.database.featherSequelize();
        return 'ok';
    }

    /**
     * Route database feathers-mongoose
     * @return Promise
     */
    async routeFeathersMongoose() {
        await this.database.featherMongoose();
        return 'ok';
    }

    /**
     * Route database feathers-mongodb
     * @return Promise
     */
    async routeFeathersMongoDB() {
        await this.database.featherMongoDB();
        return 'ok';
    }
}

export default DatabaseRouter
