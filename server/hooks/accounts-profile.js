'use strict';

const debug = require('debug')('app:hooks.accounts-profile');

module.exports = function () {
    return function (context) {
        const user = {email: '', profile: {}, tokens: []};
        //---------------
        // Twitter account
        if (context.data.twitter) {
            const twitter = context.data.twitter;
            const profile = context.data.twitter.profile;
            user.email = `${profile.username}@twitter.com`;
            user.twitterId = profile.id;
            user.tokens.push({kind: 'twitter', accessToken: twitter.accessToken, refreshToken: twitter.refreshToken});
            user.profile.name = profile.displayName;
            user.profile.location = profile._json.location;
            user.profile.picture = profile._json.profile_image_url_https;

            // Override the original data (so that people can't submit additional stuff)
            context.data = user;
        }
        // Google account
        if (context.data.google) {
            const google = context.data.google;
            const profile = context.data.google.profile;
            user.email = profile.emails[0].value;
            user.googleId = profile.id;
            user.tokens.push({kind: 'google', accessToken: google.accessToken});
            user.profile.name = profile.displayName;
            user.profile.gender = profile._json.gender;
            user.profile.picture = profile._json.image.url;

            // Override the original data (so that people can't submit additional stuff)
            context.data = user;
        }
        // Instagram account
        if (context.data.instagram) {
            const instagram = context.data.instagram;
            const profile = context.data.instagram.profile;
            user.email = `${profile.username}@instagram.com`;
            user.instagramId = profile.id;
            user.tokens.push({kind: 'instagram', accessToken: instagram.accessToken});
            user.profile.website = profile._json.data.website;
            user.profile.picture = profile._json.data.profile_picture;

            // Override the original data (so that people can't submit additional stuff)
            context.data = user;
        }
        // Facebook account
        if (context.data.facebook) {
            const facebook = context.data.facebook;
            const profile = context.data.facebook.profile;
            user.email = profile._json.email;
            user.facebookId = profile.id;
            user.tokens.push({kind: 'facebook', accessToken: facebook.accessToken});
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = profile._json.gender;
            user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.profile.location = (profile._json.location) ? profile._json.location.name : '';

            // Override the original data (so that people can't submit additional stuff)
            context.data = user;
        }
        // GitHub account
        if (context.data.github) {
            const github = context.data.github;
            const profile = context.data.github.profile;
            user.email = profile._json.email;
            user.githubId = profile.id;
            user.tokens.push({kind: 'github', accessToken: github.accessToken});
            user.profile.name = profile.displayName;
            user.profile.picture = profile._json.avatar_url;
            user.profile.location = profile._json.location;
            user.profile.website = profile._json.blog;

            // Override the original data (so that people can't submit additional stuff)
            context.data = user;
        }

        // If you want to do something whenever any OAuth
        // provider authentication occurs you can do this.
        if (context.params.oauth) {
            // do something for all OAuth providers
        }

        if (context.params.oauth && context.params.oauth.provider === 'twitter') {
            // do something specific to the twitter provider
        }

        return Promise.resolve(context);
    };
};
