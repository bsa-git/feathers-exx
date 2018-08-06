'use strict';

const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
// const {local, Verifier} = require('@feathersjs/authentication-local');

// class CustomVerifier extends Verifier {
//   // The verify function has the exact same inputs and
//   // return values as a vanilla passport strategy
//   verify(req, username, password, done) {
//     // do your custom stuff. You can call internal Verifier methods
//     // and reference this.app and this.options. This method must be implemented.
//
//     // the 'user' variable can be any truthy value
//     // the 'payload' is the payload for the JWT access token that is generated after successful authentication
//     done(null, user, payload);
//   }
// }

module.exports = function (app) {

    // Get config for authentication
    const config = app.get('authentication');

    // Set up authentication with the secret
    app.configure(authentication(config));
    app.configure(jwt());
    app.configure(local());

    // The `authentication` service is used to create a JWT.
    // The before `create` hook registers strategies that can be used
    // to create a new valid JWT (e.g. local or oauth2)
    app.service('authentication').hooks({
        before: {
            create: [
                authentication.hooks.authenticate(config.strategies)
            ],
            remove: [
                authentication.hooks.authenticate('jwt')
            ]
        }
    });
};
