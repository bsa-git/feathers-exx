"use strict";

const fs = require('fs');
const path = require('path');

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

// console.log('filePathEnv: ',filePath);

// env.node_env = process.env.NODE_ENV;

const appEnv = env.app_env ? env.app_env : 'development';

const config = {
    development: development,
    production: production,
    testing: testing
}

const envConfig = Object.assign(config[appEnv], env[appEnv]);
const globalConfig = Object.assign(global, env['global']);
const appConfig = Object.assign(globalConfig, envConfig);

module.exports = appConfig
