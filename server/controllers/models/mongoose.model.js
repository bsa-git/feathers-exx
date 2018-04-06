"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    counter: {type: Number, required: true},
    message: {type: String, required: true}
});
const Model = mongoose.model('Message', MessageSchema);

module.exports = Model;