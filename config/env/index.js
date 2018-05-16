"use strict";

const fs = require('fs');
const path = require('path');
var merge = require('lodash/merge');

const global = require('./global');
const development = require('./development');
const production = require('./production');
const testing = require('./testing');

let env, filePath;

try {
    filePath = path.join(__dirname, '../../env.js');
    fs.accessSync(filePath);
    env = require(filePath);
} catch (err) {
    filePath = path.join(__dirname, '../../env.example.js');
    env = require(filePath);
}

const appEnv = env.app_env ? env.app_env : 'development';
process.env['NODE_ENV'] = appEnv;

const config = {
    development: development,
    production: production,
    testing: testing
};

const envConfig = merge(config[appEnv], env[appEnv]);
const globalConfig = merge(global, env['global']);
const appConfig = merge(globalConfig, envConfig, {app_env: appEnv});

module.exports = appConfig;
