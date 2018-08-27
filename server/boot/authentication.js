'use strict';

const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const oauth1 = require('@feathersjs/authentication-oauth1');
const oauth2 = require('@feathersjs/authentication-oauth2');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const debug = require('debug')('app:boot.authentication');

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
    const twitterConfig = Object.assign(config['twitter'], {
        Strategy: TwitterStrategy
    });
    const facebookConfig = Object.assign(config['facebook'], {
        Strategy: FacebookStrategy
    });
    const githubConfig = Object.assign(config['github'], {
        Strategy: GitHubStrategy
    });
    const instagramConfig = Object.assign(config['instagram'], {
        Strategy: InstagramStrategy
    });
    const googleConfig = Object.assign(config['google'], {
        Strategy: GoogleStrategy
    });

    // Set up authentication with the secret
    app.configure(authentication(config));
    app.configure(jwt());
    app.configure(local());
    app.configure(oauth1(twitterConfig));
    app.configure(oauth2(facebookConfig));
    app.configure(oauth2(githubConfig));
    app.configure(oauth2(instagramConfig));
    app.configure(oauth2(googleConfig));

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
