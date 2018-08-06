'use strict';

// Initializes the `users` service on path `/users`
const service = require('feathers-nedb');
const model = require('./users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {
    const Model = model(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'users',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/users', service(options));

    // Get our initialized service so that we can register hooks and filters
    const users = app.service('users');

    users.hooks(hooks);
};
