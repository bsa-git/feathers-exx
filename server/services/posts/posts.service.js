// Initializes the `messages` service on path `/messages`
const service = require('feathers-nedb');
const model = require('./posts.model');
const hooks = require('./posts.hooks');

module.exports = function (app) {
  const Model = model(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'posts',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/posts', service(options));

  // Get our initialized service so that we can register hooks and filters
  const posts = app.service('posts');

    posts.hooks(hooks);
};
