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

/*
const twitter = {
    "twitterId":"895175665007415298",
    "twitter":{
        "profile":{
            "id":"895175665007415298",
            "username":"bsa2657",
            "displayName":"Сергей Бескоровайный",
            "photos":[{"value":"https://pbs.twimg.com/profile_images/895179231797420034/WuoNLkaq_normal.jpg"}],
            "provider":"twitter",
            "_raw":"{\"id\":895175665007415298,\"id_str\":\"895175665007415298\",\"name\":\"\\u0421\\u0435\\u0440\\u0433\\u0435\\u0439 \\u0411\\u0435\\u0441\\u043a\\u043e\\u0440\\u043e\\u0432\\u0430\\u0439\\u043d\\u044b\\u0439\",\"screen_name\":\"bsa2657\",\"location\":\"\",\"description\":\"\",\"url\":null,\"entities\":{\"description\":{\"urls\":[]}},\"protected\":false,\"followers_count\":0,\"friends_count\":5,\"listed_count\":0,\"created_at\":\"Wed Aug 09 06:51:24 +0000 2017\",\"favourites_count\":0,\"utc_offset\":null,\"time_zone\":null,\"geo_enabled\":false,\"verified\":false,\"statuses_count\":0,\"lang\":\"ru\",\"contributors_enabled\":false,\"is_translator\":false,\"is_translation_enabled\":false,\"profile_background_color\":\"F5F8FA\",\"profile_background_image_url\":null,\"profile_background_image_url_https\":null,\"profile_background_tile\":false,\"profile_image_url\":\"http:\\/\\/pbs.twimg.com\\/profile_images\\/895179231797420034\\/WuoNLkaq_normal.jpg\",\"profile_image_url_https\":\"https:\\/\\/pbs.twimg.com\\/profile_images\\/895179231797420034\\/WuoNLkaq_normal.jpg\",\"profile_link_color\":\"1DA1F2\",\"profile_sidebar_border_color\":\"C0DEED\",\"profile_sidebar_fill_color\":\"DDEEF6\",\"profile_text_color\":\"333333\",\"profile_use_background_image\":true,\"has_extended_profile\":false,\"default_profile\":true,\"default_profile_image\":false,\"following\":false,\"follow_request_sent\":false,\"notifications\":false,\"translator_type\":\"none\",\"suspended\":false,\"needs_phone_verification\":false}",
            "_json":{
                "id":895175665007415300,
                "id_str":"895175665007415298",
                "name":"Сергей Бескоровайный",
                "screen_name":"bsa2657",
                "location":"",
                "description":"",
                "url":null,
                "entities":{"description":{"urls":[]}},
                "protected":false,
                "followers_count":0,
                "friends_count":5,
                "listed_count":0,
                "created_at":"Wed Aug 09 06:51:24 +0000 2017",
                "favourites_count":0,
                "utc_offset":null,
                "time_zone":null,
                "geo_enabled":false,
                "verified":false,
                "statuses_count":0,
                "lang":"ru",
                "contributors_enabled":false,
                "is_translator":false,
                "is_translation_enabled":false,
                "profile_background_color":"F5F8FA",
                "profile_background_image_url":null,
                "profile_background_image_url_https":null,
                "profile_background_tile":false,
                "profile_image_url":"http://pbs.twimg.com/profile_images/895179231797420034/WuoNLkaq_normal.jpg",
                "profile_image_url_https":"https://pbs.twimg.com/profile_images/895179231797420034/WuoNLkaq_normal.jpg",
                "profile_link_color":"1DA1F2",
                "profile_sidebar_border_color":"C0DEED",
                "profile_sidebar_fill_color":"DDEEF6",
                "profile_text_color":"333333",
                "profile_use_background_image":true,
                "has_extended_profile":false,
                "default_profile":true,
                "default_profile_image":false,
                "following":false,
                "follow_request_sent":false,
                "notifications":false,
                "translator_type":"none",
                "suspended":false,
                "needs_phone_verification":false},
            "_accessLevel":"read-write"},
        "accessToken":"895175665007415298-3UpuHcidibImBTXcmoUam3dfrk9yFGY",
        "refreshToken":"VGSY0MTVSvuEf9OIRODRRCYSxbKnJjuzvBcUY8gdXcl0q"},
    "avatar":"https://s.gravatar.com/avatar/92f61ab8f4083981dca1605e0787239f?s=60",
    "_id":"wa8ExAfbwDnKvnxF"};
*/

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
