"use strict";

const config = require('../../../config/env');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    counter: {type: Integer, required: true},
    message: {type: String, required: true}
});
const Model = mongoose.model('Message', MessageSchema);

module.exports = Model;