"use strict";

const {authenticate} = require('@feathersjs/authentication').hooks;
const {hashPassword, protect} = require('@feathersjs/authentication-local').hooks;

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const {validateSchema} = require('feathers-hooks-common');
const userSchema = require('../../../validations/user-schema.json');

const gravatar = require('../../hooks/gravatar');
const accountsProfile = require('../../hooks/accounts-profile');

module.exports = {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [authenticate('jwt')],
        create: [validateSchema(userSchema, ajv), hashPassword(), accountsProfile(), gravatar()],
        update: [hashPassword(), authenticate('jwt'), accountsProfile()],
        patch: [hashPassword(), authenticate('jwt'), accountsProfile()],
        remove: [authenticate('jwt')]
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect('password')
        ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
