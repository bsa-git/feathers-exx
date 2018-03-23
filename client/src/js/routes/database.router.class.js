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
}

export default DatabaseRouter
