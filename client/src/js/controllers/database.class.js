"use strict";

import Base from './base.class'

class Database extends Base {
    constructor(client) {
        super(client);
    }

    /**
     * REST Client - feathers application
     * @return Promise
     */
    async feathersMemory() {
        const self = this;
        const restURL = `${this.req.protocol}//${this.req.hostname}:${this.config.app.exxPort}`;
        const feathers = require('@feathersjs/client');
        const axios = require('axios');
        //---------------------------------

        const app = feathers();

        // Connect to a different URL
        const restClient = feathers.rest(restURL);

        // Configure an AJAX library (see below) with that client
        // app.configure(restClient.axios(axios));
        app.configure(restClient.axios(axios));

        // Connect to the `http://localhost:3030/messages` service
        const serviceMessages = app.service('messages');


        // Render twig template
        const _twigRender = (data) => {
            const template = require('../tmpls/database/feathers-memory/messages.html.twig');
            const html = template(data);
            self.bulma.addMessage(html);
        };

        /**
         * Find service messages and display
         * @param context Object
         * context = {
         *  query: {query: { $limit: 2, read: false}},
         *  strQuery: '{query: { $limit: 2, read: false}}',
         *  name: '$limit',
         *  description: ' will return only the number of results you specify'
         * }
         * @return {Promise.<*>}
         */
        const serviceMessagesFind = async (context) => {
            // Find messages
            const messages = await serviceMessages.find({query: context.query});
            _twigRender({messages, name: context.name, description: context.description, strQuery: context.strQuery});
            return messages;
        };

        let context = {
            query: {
                counter: 5
            },
            strQuery: 'query: { counter: 5}',
            name: 'Equality',
            description: 'All fields that do not contain special query parameters are compared directly for equality.'
        };
        let messages = await serviceMessagesFind(context);
        console.log("Messages for 'Equality': ",messages);
        return 'ok';
    }
}

export default Database
