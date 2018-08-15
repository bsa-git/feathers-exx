"use strict";

import Chat from '../controllers/chat.vanilla.class'
import Auth from '../controllers/auth.client.class'
const debug = require('debug')('app:auth.router');

class AuthRouter {
    constructor(client) {
        this.client = client;
    }

    /**
     * Route auth chat
     * @return Promise
     */
    async routeAuthChat() {
        const chat = new Chat(this.client);
        await chat.init();
        await chat.login();
        return 'ok';
    }

    /**
     * Route auth server
     * @return Promise
     */
    async routeAuthServer() {
        let isAuth, auth;
        try {
            isAuth = true;
            // Create auth controller
            auth = new Auth(this.client);
            await auth.appAuthenticate();
        } catch (error) {
            isAuth = false
        } finally {
            // Insert load.html.twig
            const template = require('../tmpls/auth/server/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authServer();
        }
        return 'ok';
    }

    /**
     * Route auth client
     * @return Promise
     */
    async routeAuthClient() {
        let isAuth, auth;
        try {
            isAuth = true;
            // Create auth controller
            auth = new Auth(this.client);
            await auth.app.authenticate();
        } catch (error) {
            isAuth = false
        } finally {
            // Insert load.html.twig
            const template = require('../tmpls/auth/client/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authClient();
        }
        return 'ok';
    }
}
export default AuthRouter