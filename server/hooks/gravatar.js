// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// We need this to create the MD5 hash
const crypto = require('crypto');
const debug = require('debug')('app:hooks.gravatar');

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {
        // The user email
        const {email} = context.data;
        debug('context.data: ', context.data);
        const lowerCaseEmail = email ? email.toLowerCase() : 'my@test.com';

        // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
        const hash = crypto.createHash('md5').update(lowerCaseEmail).digest('hex');

        context.data.avatar = `${gravatarUrl}/${hash}?${query}`;

        // Best practise, hooks should always return the context
        return context;
    };
};
