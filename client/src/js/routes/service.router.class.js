"use strict";

import Service from '../controllers/service.class'

class ServiceRouter {
    constructor(client) {
        this.client = client;
        this.service = new Service(client);
    }

    /**
     * Route our first feathers application on client
     * @param name String
     * @return Promise
     */
    async routeServiceStartClient(name) {
        const result = await this.service.startClient(name);
        const msgBox = {type: 'info', text: result};
        this.client.bulma.showMessage({msgBox: msgBox});
        return 'ok';
    }

    /**
     * Route REST and services
     * @return Promise
     */
    async routeServiceRestApis() {

        // // Add listener for 'create button'
        const cbs = await this.service.restApis();
        this.client.bulma.addListener('#create-message', cbs['create']);

        // Add listener for 'get button'
        this.client.bulma.addListener('#get-message', cbs['get']);

        // Add listener for 'find button'
        this.client.bulma.addListener('#find-messages', cbs['find']);

        // Add listener for 'patch button'
        this.client.bulma.addListener('#patch-message', cbs['patch']);

        // Add listener for 'delete button'
        this.client.bulma.addListener('#remove-message', cbs['delete']);

        return 'ok';
    }

    /**
     * Route REST Client
     * @return Promise
     */
    async routeServiceRestClient() {

        // Add listener for 'create button'
        const cbs = await this.service.restClient();
        this.client.bulma.addListener('#create-message', cbs['create']);

        // Add listener for 'get button'
        this.client.bulma.addListener('#get-message', cbs['get']);

        // Add listener for 'find button'
        this.client.bulma.addListener('#find-messages', cbs['find']);

        // Add listener for 'patch button'
        this.client.bulma.addListener('#patch-message', cbs['patch']);

        // Add listener for 'delete button'
        this.client.bulma.addListener('#remove-message', cbs['delete']);

        return 'ok';
    }

    /**
     * Route Real-time APIs
     * @return Promise
     */
    async routeServiceRealTime() {

        // Add listener for 'create button'
        const cbs = await this.service.realTime();
        this.client.bulma.addListener('#create-message', cbs['create']);

        // Add listener for 'get button'
        this.client.bulma.addListener('#get-message', cbs['get']);

        // Add listener for 'find button'
        this.client.bulma.addListener('#find-messages', cbs['find']);

        // Add listener for 'patch button'
        this.client.bulma.addListener('#patch-message', cbs['patch']);

        // Add listener for 'delete button'
        this.client.bulma.addListener('#remove-message', cbs['delete']);

        return 'ok';
    }
}

export default ServiceRouter
