"use strict";

import Database from '../controllers/database.class'

class DatabaseRouter {
    constructor(client) {
        this.client = client;
        this.database = new Database(client);
    }

    /**
     * Database Feathers Memory
     * @return Promise
     */
    async databaseFeathersMemory() {
        // Run feathersMemory action
        await this.database.feathersMemory();
        return 'ok';
    }

    /**
     * Database Feathers NeDB
     * @return Promise
     */
    async databaseFeathersNeDB() {
        // Run feathersNeDB action
        await this.database.feathersNeDB();
        return 'ok';
    }

    /**
     * DataBase Feathers LocalStorage
     * @return Promise
     */
    async databaseFeathersLocalStorage() {
        await this.database.feathersLocalStorage();
        return 'ok';
    }
}

export default DatabaseRouter
