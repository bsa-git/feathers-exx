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
            await auth.serverAuthenticate();
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

    /**
     * Route auth local
     * @return Promise
     */
    async routeAuthLocal() {
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
            const template = require('../tmpls/auth/local/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authLocal();
        }
        return 'ok';
    }

    /**
     * Route auth jwt
     * @return Promise
     */
    async routeAuthJwt() {
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
            const template = require('../tmpls/auth/jwt/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authJwt();
        }
        return 'ok';
    }

    /**
     * Route OAuth1
     * @return Promise
     */
    async routeOAuth1() {
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
            const template = require('../tmpls/auth/oauth1/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authOAuth1();
        }
        return 'ok';
    }

    /**
     * Route OAuth1Ok
     * @return Promise
     */
    async routeOAuth1Ok() {
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
            const template = require('../tmpls/auth/oauth1/auth-ok.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authOAuth1();
        }
        return 'ok';
    }

    /**
     * Route OAuth2
     * @return Promise
     */
    async routeOAuth2() {
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
            const template = require('../tmpls/auth/oauth2/load.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authOAuth2();
        }
        return 'ok';
    }

    /**
     * Route OAuth2Ok
     * @return Promise
     */
    async routeOAuth2Ok() {
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
            const template = require('../tmpls/auth/oauth2/auth-ok.html.twig');
            const html = template({isAuth});
            document.getElementById('app').innerHTML = html;
            // Run authClient action
            await auth.authOAuth2();
        }
        return 'ok';
    }
}
export default AuthRouter