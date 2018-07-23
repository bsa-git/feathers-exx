"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    counter: {type: Number, required: true},
    message: {type: String, required: true}
});
const Model = mongoose.model('Message', MessageSchema);

module.exports.Model = Model;
module.exports.connect = async (app) => {
    mongoose.Promise = global.Promise;
    const config = app.get('database')['mongoose'];

    const options = {
        useNewUrlParser: true
    };
    // Connect to your MongoDB instance(s)
    await mongoose.connect(config.connection_string, options);
};