"use strict";

var merge = require('lodash/merge');
const global = require('./global');
const development = require('./development');
const production = require('./production');
const testing = require('./testing');
const env = require('../../env.js');


// env.node_env = process.env.NODE_ENV;

const appEnv = env.app_env ? env.app_env : 'development';

const config = {
    development: development,
    production: production,
    testing: testing
}

const envConfig = merge(config[appEnv], env[appEnv]);
const globalConfig = merge(global, env['global']);
const appConfig = merge(globalConfig, envConfig);

module.exports = appConfig
