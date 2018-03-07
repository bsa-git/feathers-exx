"use strict";

import Service from '../controllers/service.class'

class ServiceRouter {
    constructor(client) {
        this.client = client;
        this.service = new Service(client);
    }

    /**
     * Our first Feathers application on client
     * @param name String
     * @return Promise
     */
    async serviceStartClient(name) {
        const result = await this.service.startClient(name);
        const msgBox = {type: 'info', text: result};
        this.client.bulma.showMessage({msgBox: msgBox});
        return 'ok';
    }

    /**
     * Our first Feathers application on client
     * @param name String
     * @return Promise
     */
    async serviceRestApis() {
        // Find message
        const url = `${this.client.req.protocol}//${this.client.req.hostname}:${this.client.config.app.exxPort}/messages`;
        console.log(`HttpBox.get url: `, url);
        let messages = await this.client.req.get(url);
        console.log(`HttpBox.get response: `, messages);
        // Render twig template
        const template = require('../tmpls/service/rest-apis/messages.html.twig');
        const html = template({messages, port: 1234});
        this.client.bulma.addMessage(html);
        // Create message
        messages = await this.client.req.post('http://localhost:3030/messages',{text: 'Client message'});
        console.log(`HttpBox.post response: `, messages);

        // Patch message
        messages = await this.client.req.patch('http://localhost:3030/messages/4',{text: 'Patch Client message'});
        console.log(`HttpBox.patch response: `, messages);

        // Update message
        messages = await this.client.req.put('http://localhost:3030/messages/4',{text: 'Update Client message'});
        console.log(`HttpBox.put response: `, messages);

        // Update message
        messages = await this.client.req.delete('http://localhost:3030/messages/4');
        console.log(`HttpBox.delete response: `, messages);

        /*
        let configFetch = {
            method: 'GET', // *GET, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *same-origin
        };
        let response = await fetch('http://localhost:3030/messages', configFetch);
        let messages = await response.json();
        console.log(`HttpBox.get response: `, messages);

        let data = {text: 'Client message'};
        configFetch = {
            body: JSON.stringify(data), // must match 'Content-Type' header
            method: 'POST', // *GET, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *same-origin
            headers: {
                'content-type': 'application/json'
            },
        };

        response = await fetch('http://localhost:3030/messages', configFetch);
        messages = await response.json();
        console.log(`HttpBox.get response: `, messages);
        */
        return 'ok';
    }
}

export default ServiceRouter
