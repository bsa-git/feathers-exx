"use strict";

const config = require('../../../config/env');

class Messages {
    constructor() {
        // this.req = req;
        this.messages = [];
        this.currentId = 0;
    }

    async find(params) {
        // Return the list of all messages
        if(config.debug){
            console.log(`Service.messages.find: `, this.messages);
        }
        return this.messages;
    }

    async get(id, params) {
        // Find the message by id
        const message = this.messages.find(message => message.id === parseInt(id, 10));

        // Throw an error if it wasn't found
        if (!message) {
            throw new Error(`Message with id ${id} not found`);
        }
        if(config.debug){
            console.log(`Service.messages.get(id=${id}): `, message);
        }

        // Otherwise return the message
        return message;
    }

    async create(data, params) {
        // Create a new object with the original data and an id
        // taken from the incrementing `currentId` counter
        const message = Object.assign({
            id: ++this.currentId
        }, data);
        this.messages.push(message);
        if(config.debug){
            console.log(`Service.messages.create: `, message);
        }
        return message;
    }

    async patch(id, data, params) {
        // Get the existing message. Will throw an error if not found
        let message = await this.get(id);
        message = Object.assign(message, data);
        if(config.debug){
            console.log(`Service.messages.patch: `, 'data=', data, '; message=', message);
        }
        // Merge the existing message with the new data
        // and return the result
        return message;
    }

    async update(id, data, params) {// update
        // Get the existing message. Will throw an error if not found
        let message = await this.get(id);
        message = Object.assign({id: message.id}, data);
        if(config.debug){
            console.log(`Service.messages.update: `, 'data=', data, '; message=', message);
        }
        // Merge the existing message with the new data
        // and return the result
        return message;
    }

    async remove(id, params) {
        // Get the message by id (will throw an error if not found)
        const message = await this.get(id);
        // Find the index of the message in our message array
        const index = this.messages.indexOf(message);

        // Remove the found message from our array
        this.messages.splice(index, 1);
        if(config.debug){
            console.log(`Service.messages.remove(id=${id}): `, message);
        }
        // Return the removed message
        return message;
    }
}

module.exports = Messages;
