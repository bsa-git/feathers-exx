"use strict";

import Chat from '../controllers/chat.vanilla.class'

class AuthRouter {
    constructor(client) {
        this.client = client;
        this.chat = new Chat(client);
    }

    /**
     * Route chat
     * @return Promise
     */
    async routeAuthChat() {

        await this.chat.init();

        this.chat.login();

        // // Add listener for 'create button'
        // const cbs = await this.service.restApis();
        // this.client.bulma.addListener('#create-message', cbs['create']);
        //
        // // Add listener for 'get button'
        // this.client.bulma.addListener('#get-message', cbs['get']);
        //
        // // Add listener for 'find button'
        // this.client.bulma.addListener('#find-messages', cbs['find']);
        //
        // // Add listener for 'patch button'
        // this.client.bulma.addListener('#patch-message', cbs['patch']);
        //
        // // Add listener for 'delete button'
        // this.client.bulma.addListener('#remove-message', cbs['delete']);

        return 'ok';
    }
}
export default AuthRouter