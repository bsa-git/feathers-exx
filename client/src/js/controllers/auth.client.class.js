"use strict";

import Base from './base.client.class'
import Chat from './chat.vanilla.class'
import Cookie from '../plugins/cookie.class'
const debug = require('debug')('app:auth.controller');

class Auth extends Base {
    constructor(context) {
        super(context);
        this.urlHost = `${this.req.protocol}//${this.req.hostname}`;
        if (process.env.NODE_ENV === 'development') {
            this.urlHost += `:${this.data.port}`;
        }
        this.urlAuthService = `${this.urlHost}/authentication`;
        this.urlAuthUsers = `${this.urlHost}/users`;
        this.urlAuthTwitter = `${this.urlHost}/auth/twitter`;
        this.app = this.setRestTransport();
        this.chat = new Chat(context);
        this.getCredentials = this.chat.getCredentials.bind(this);
        this.login = this.chat.login.bind(this);
        this.showLogin = this.chat.showLogin.bind(this);
        this.addClickListener = this.chat.addClickListener.bind(this);
    }

    /**
     * Action auth client
     * @return Promise
     */
    async authClient() {
        await this.addClickListener();
    }

    /**
     * Action auth local
     * @return Promise
     */
    async authLocal() {
        await this.addClickListener();
    }

    /**
     * Action auth jwt
     * @return Promise
     */
    async authJwt() {
        await this.addClickListener();
    }

    /**
     * Action OAuth1
     * @return Promise
     */
    async authOAuth1() {
        const self = this;
        //------------------
        await document.addEventListener('click', async ev => {
            try {
                switch (ev.target.id) {
                    case 'logout': {
                        ev.preventDefault();
                        await this.app.logout();
                        self.app.set('user', null);
                        self.userId = null;
                        const cookie = new Cookie('feathers-jwt');
                        cookie.remove('/', this.req.hostname);
                        const template = require('../tmpls/auth/oauth1/load.html.twig');
                        const html = template({isAuth: self.isAuth(self.app)});
                        document.getElementById('app').innerHTML = html;
                        break;
                    }
                }
            } catch (ex) {
                self.bulma.showError(ex);
            }
        });
    }

    /**
     * Action OAuth2
     * @return Promise
     */
    async authOAuth2() {
        const self = this;
        //------------------
        await document.addEventListener('click', async ev => {
            try {
                switch (ev.target.id) {
                    case 'logout': {
                        ev.preventDefault();
                        await this.app.logout();
                        self.app.set('user', null);
                        self.userId = null;
                        const cookie = new Cookie('feathers-jwt');
                        cookie.remove('/', this.req.hostname);
                        debug('authOAuth2.cookie.remove:', this.req.hostname);
                        const template = require('../tmpls/auth/oauth2/load.html.twig');
                        const html = template({isAuth: self.isAuth(self.app)});
                        document.getElementById('app').innerHTML = html;
                        break;
                    }
                }
            } catch (ex) {
                self.bulma.showError(ex);
            }
        });
    }

    /**
     * Action auth server
     * @return Promise
     */
    async authServer() {
        const self = this;
        let credentials;
        //---------------------------------
        await document.addEventListener('click', async ev => {
            try {
                switch (ev.target.id) {
                    case 'authenticate': {
                        ev.preventDefault();
                        await self.serverLogin();
                        break;
                    }
                    case 'signup': {
                        ev.preventDefault();
                        // For signup, create a new user and then log them in
                        credentials = self.getCredentials();
                        // First create the user
                        await self.serverSignUp(credentials);
                        // If successful log them in
                        await self.serverLogin(credentials);
                        break;
                    }
                    case 'login': {
                        ev.preventDefault();
                        credentials = self.getCredentials();
                        await self.serverLogin(credentials);
                        break;
                    }
                    case 'logout': {
                        ev.preventDefault();
                        await this.serverLogOut();
                        const template = require('../tmpls/auth/chat/login.html.twig');
                        const loginHTML = template();
                        document.getElementById('app').innerHTML = loginHTML;
                        break;
                    }
                }
            } catch (ex) {
                self.bulma.showError(ex);
            }
        });
    }

    /**
     * serverLogin
     * @param credentials Object
     * @return Promise
     */
    async serverLogin(credentials) {
        try {
            if (!credentials) {
                // Try to authenticate using the JWT from localStorage
                await this.serverAuthenticate();
            } else {
                // If we get login information, add the strategy we want to use for login
                const payload = Object.assign({strategy: 'local'}, credentials);
                await this.serverAuthenticate(payload);
            }
            // If successful, show the chat page
            await this.showChat();
        } catch (error) {
            // If we got an error, show the login page
            this.showLogin(error);
        }
    }

    /**
     * serverAuthenticate
     * @param payload Object
     * @return Promise
     */
    async serverAuthenticate(payload) {
        let response;
        const storage = window.localStorage;
        //--------------
        if (payload) {
            response = await this.req.post(this.urlAuthService, payload);
        } else {
            const accessToken = storage.getItem('feathers-jwt');
            const config = {headers: {'Authorization': accessToken}};
            response = await this.req.post(this.urlAuthService, null, config);
        }
        const accessToken = response['accessToken'];
        if (accessToken && !storage.getItem('feathers-jwt')) {
            storage.setItem('feathers-jwt', accessToken);
            this.app.set('accessToken', accessToken);
            // Cookie store
            const cookie = new Cookie('feathers-jwt');
            cookie.store(1, '/', this.req.hostname);

            // Get user using accessToken
            const payload = await this.verifyJWT(accessToken);
            const config = {headers: {'Authorization': accessToken}};
            const user = await this.req.get(`${this.urlAuthUsers}/${payload.userId}`, config);
            this.app.set('user', user);
            debug('Logged in user:', this.app.get('user'));
        }
        return response
    }

    /**
     * serverSignUp
     * @param credentials Object
     * @return Promise
     */
    async serverSignUp(credentials) {
        return await this.req.post(this.urlAuthUsers, credentials);
    }

    /**
     * serverLogOut
     * @return Promise
     */
    async serverLogOut() {
        const storage = window.localStorage;
        //--------------
        if (storage.getItem('feathers-jwt')) {
            const accessToken = storage.getItem('feathers-jwt');
            const config = {headers: {'Authorization': accessToken}};
            const response = await this.req.delete(this.urlAuthService, config);
            if (response['accessToken']) {
                storage.removeItem('feathers-jwt');
                this.app.set('accessToken', null);
                this.app.set('user', null);
                const cookie = new Cookie('feathers-jwt');
                cookie.remove('/', this.req.hostname);
            }
        }
    }

    /**
     * showChat
     */
    async showChat() {
        // Insert auth-ok.html.twig
        const action = this.req.action;
        const template = require(`../tmpls/auth/${action}/auth-ok.html.twig`);
        const html = template({isAuth: this.isAuth(this.app)});
        document.getElementById('app').innerHTML = html;
    }
}

export default Auth;
