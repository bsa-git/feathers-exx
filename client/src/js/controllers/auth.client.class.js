"use strict";

import Base from './base.client.class'
import Chat from './chat.vanilla.class'

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
        this.app = this.setRestTransport();
        this.chat = new Chat(context);
        this.getCredentials = this.chat.getCredentials.bind(this);
        this.login = this.chat.login.bind(this);
        this.showLogin = this.chat.showLogin.bind(this);
        this.addClickListener = this.chat.addClickListener.bind(this);
    }

    /**
     * Action auth server
     * @return Promise
     */
    async authClient() {
        await this.addClickListener();
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
                        await self.appSignUp(credentials);
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
                        await this.appLogOut();
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
     * Action login
     * @param credentials Object
     * @return Promise
     */
    async serverLogin(credentials) {
        let response;
        //----------------------
        try {
            if (!credentials) {
                // Try to authenticate using the JWT from localStorage
                await this.appAuthenticate();
            } else {
                // If we get login information, add the strategy we want to use for login
                const payload = Object.assign({strategy: 'local'}, credentials);
                await this.appAuthenticate(payload);
            }
            // If successful, show the chat page
            await this.showChat();
        } catch (error) {
            // If we got an error, show the login page
            this.showLogin(error);
        }
    }

    /**
     * appAuthenticate
     * @param payload Object
     * @return Promise
     */
    async appAuthenticate(payload) {
        let response;
        const storage = window.localStorage;
        const Utils = require('../../../../plugins/utils.class');
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

            // Get user using accessToken
            const payload = await Utils.verifyJWT(accessToken);
            const config = {headers: {'Authorization': accessToken}};
            const user = await this.req.get(`${this.urlAuthUsers}/${payload.userId}`, config);
            this.app.set('user', user);
            debug('Logged in user:', this.app.get('user'));
        }
        return response
    }

    /**
     * appSignUp
     * @param credentials Object
     * @return Promise
     */
    async appSignUp(credentials) {
        return await this.req.post(this.urlAuthUsers, credentials);
    }

    /**
     * appLogOut
     * @return Promise
     */
    async appLogOut() {
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
            }
        }
    }

    /**
     * showChat
     */
    async showChat() {
        // Insert auth-ok.html.twig
        const template = require('../tmpls/auth/client/auth-ok.html.twig');
        const html = template({isAuth: this.isAuth(this.app)});
        document.getElementById('app').innerHTML = html;
    }
}

export default Auth;
