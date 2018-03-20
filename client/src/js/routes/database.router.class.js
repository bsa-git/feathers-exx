"use strict";

import Database from '../controllers/database.class'

class DatabaseRouter {
    constructor(client) {
        this.client = client;
        this.database = new Database(client);
    }

    /**
     * Real-time APIs
     * @return Promise
     */
    async databaseFeathersMemory() {
        // Run feathersMemory action
        await this.database.feathersMemory();
        return 'ok';
    }
}

export default DatabaseRouter
