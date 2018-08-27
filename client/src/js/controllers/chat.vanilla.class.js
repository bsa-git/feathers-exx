"use strict";

import Base from './base.client.class'
import moment from 'moment'
import cookies from 'browser-cookies'
const debug = require('debug')('app:chat.controller');

class Chat extends Base {
    constructor(context) {
        super(context);
    }

    /**
     * Action init
     * @return Promise
     */
    async init() {
        this.app = this.setRestTransport();
        await this.addClickListener();
        await this.addSubmitListener();
        await this.addRealTimeListener();
    }

    /**
     * Action getCredentials
     * Retrieve email/password object from the login/signup page
     */
    getCredentials() {
        const errors = require('@feathersjs/errors');
        const Ajv = require('../../../../node_modules/ajv/dist/ajv.min');
        const ajv = new Ajv({allErrors: true});
        const userSchema = require('../../../../validations/user-schema.json');
        const getFormatErrors = require('../../../../validations/ajv-errors').getFormatErrors;
        const validate = ajv.compile(userSchema);
        //----------------------------------------------------------
        const user = {
            email: document.querySelector('[type="email"]').value,
            password: document.querySelector('[type="password"]').value
        };

        const valid = validate(user);
        if (!valid) {
            debug('Errors user credentials:', validate.errors);
            throw new errors.BadRequest('User data error', {errors: getFormatErrors(validate.errors)});
        }

        return user;
    };

    /**
     * Action login
     * @return Promise
     */
    async login(credentials) {
        let response;
        //-----------------------
        try {
            if (!credentials) {
                // Try to authenticate using the JWT from localStorage
                response = await this.app.authenticate();
            } else {
                // If we get login information, add the strategy we want to use for login
                const payload = Object.assign({strategy: 'local'}, credentials);
                response = await this.app.authenticate(payload);
            }
            if (!this.app.get('user')) {
                const user = await this.getLoggedInUser(this.app, response);
                this.app.set('user', user);
                this.userId = user._id;
                debug('Logged in user:', this.app.get('user'));
            }
            // If successful, show the chat page
            await this.showChat();
        } catch (error) {
            // If we got an error, show the login page
            this.showLogin(error);
        }
    }

    /**
     * Action showLogin
     * @param error Object
     */
    showLogin(error) {
        if (document.querySelectorAll('.login').length) {
            this.bulma.showMessage({text: error.message});
        } else {
            const template = require('../tmpls/auth/chat/login.html.twig');
            const loginHTML = template();
            document.getElementById('app').innerHTML = loginHTML;
        }
    }

    /**
     * Action showChat
     * @return Promise
     */
    async showChat() {
        const self = this;
        //---------------
        // Insert chat HTML
        const template = require('../tmpls/auth/chat/chat.html.twig');
        const chatHTML = template();
        document.getElementById('app').innerHTML = chatHTML;
        // Find the latest 10 messages. They will come with the newest first
        // which is why we have to reverse before adding them
        const messages = await this.app.service('posts').find({
            query: {
                $sort: {createdAt: -1},
                $limit: 25
            }
        });
        // We want to show the newest message last
        if (messages && messages.data.length) {
            debug('User Messages:', messages.data);
            messages.data.reverse().forEach((message) => {
                self.addMessage(message)
            });
        }
        // Find all users
        // const query = { query: {email: { $ne: null}} };
        const users = await this.app.service('users').find();// { query: {$sort: {counter: 1}, $limit: 2, counter: { $ne: 2}} }
        if (users && users.data.length) {
            debug('Users:', users.data);
            users.data.forEach(async user => {
                await self.addUser(user);
            });
            self.addSelectUsersListener();
            document.querySelector('input[name="allUsers"]').click();
        }
        this.bulma.showMessage({type: 'success', text: 'User logged in successfully!'});
    }

    /**
     * Action addUser
     * Add a new user to the list
     * @param user Object
     * @return Promise
     */
    addUser(user) {
        const self = this;
        //---------------
        return new Promise(function (resolve, reject) {
            const userList = document.querySelector('.user-list');
            if (userList) {
                // Set user active
                user.isActive = user._id === self.userId ? true : false;
                // Add the user to the list
                const template = require('../tmpls/auth/chat/user.html.twig');
                const userHTML = template(user);
                userList.insertAdjacentHTML('beforeend', userHTML);
                // Update the number of users
                const userCount = document.querySelectorAll('.user-list a.panel-block').length;
                document.querySelector('.online-count').innerHTML = userCount.toString();
                resolve();
            }
        });
    }

    /**
     * Action addMessage
     * Renders a new message and finds the user that belongs to the message
     * @param message Object
     */
    addMessage(message) {
        // Find the user belonging to this message or use the anonymous user if not found
        const user = message.user;
        const text = message.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');

        message.text = text;
        message.createdAt = moment(message.createdAt).format('MMM Do, hh:mm:ss');
        const selUsers = message.selUsers;
        const chat = document.querySelector('.message-list');
        if (chat && selUsers.includes(this.userId)) {
            const template = require('../tmpls/auth/chat/message.html.twig');
            const messageHTML = template({user, message});
            chat.insertAdjacentHTML('beforeend', messageHTML);

            chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        }
    }

    /**
     * Action getSelectedUsers
     */
    getSelectedUsers() {
        const selUsers = [];
        //------------------
        // Get selected users
        const $usersCheckbox = document.querySelectorAll('input[name="chatUser"]:checked');
        selUsers.push(this.userId);
        if ($usersCheckbox.length > 0) {
            for (let i = 0, len = $usersCheckbox.length; i < len; i++) {
                const $elm = $usersCheckbox[i];
                selUsers.push($elm.value);
            }
        }
        debug('selUsers:', selUsers);
        return selUsers;
    }

    /**
     * Action addClickListener
     * @return Promise
     */
    async addClickListener() {
        const self = this;
        let credentials;
        //------------------
        await document.addEventListener('click', async ev => {
            try {
                switch (ev.target.id) {
                    case 'authenticate': {
                        ev.preventDefault();
                        await self.login();
                        break;
                    }
                    case 'signup': {
                        ev.preventDefault();
                        // For signup, create a new user and then log them in
                        credentials = self.getCredentials();
                        // First create the user
                        await self.app.service('users').create(credentials);
                        // If successful log them in
                        await self.login(credentials);
                        break;
                    }
                    case 'login': {
                        ev.preventDefault();
                        credentials = self.getCredentials();
                        await self.login(credentials);
                        break;
                    }
                    case 'logout': {
                        ev.preventDefault();
                        await this.app.logout();
                        self.app.set('user', null);
                        self.userId = null;
                        cookies.erase('feathers-jwt');
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
     * Action addSubmitListener
     * @return Promise
     */
    async addSubmitListener() {
        const self = this;
        //------------------
        await document.addEventListener('submit', async ev => {
            try {
                if (ev.target.id === 'send-message') {
                    ev.preventDefault();
                    // Get selected users
                    const selUsers = self.getSelectedUsers();
                    // This is the message text input field
                    const input = document.querySelector('[type="text"]');
                    // Create a new message and then clear the input field
                    await self.app.service('posts').create({
                        text: input.value,
                        selUsers
                    });
                    input.value = '';
                }
            } catch (ex) {
                self.bulma.showError(ex);
            }
        });
    }

    /**
     * Action addRealTimeListener
     */
    async addRealTimeListener() {
        const self = this;
        //------------------
        try {
            // Listen to created events and add the new message in real-time
            // this.app.service('posts').on('created', this.addMessage);
            this.app.service('posts').on('created', message => {
                self.addMessage(message, self.userId);
            });
            // We will also see when new users get created in real-time
            // this.app.service('users').on('created', this.addUser);
            this.app.service('users').on('created', async user => {
                await self.addUser(user);
                self.addSelectUsersListener();
            });
        } catch (ex) {
            self.bulma.showError(ex);
        }
    }

    /**
     * Action addSelectUsersListener
     */
    addSelectUsersListener() {
        const usersCheckbox = document.querySelectorAll('input[name="chatUser"]');
        const allUsersCheckbox = document.querySelector('input[name="allUsers"]');
        //
        const usersChecked = (checked) => {
            if (usersCheckbox.length > 0) {
                for (let i = 0, len = usersCheckbox.length; i < len; i++) {
                    let $elm = usersCheckbox[i];
                    $elm.checked = checked;
                }
            }
        };
        allUsersCheckbox.onchange = function () {
            usersChecked(allUsersCheckbox.checked);
        };
    }

}

export default Chat;
