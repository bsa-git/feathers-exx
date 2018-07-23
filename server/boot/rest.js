// server/boot/rest.js

const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const cors = require('cors');

module.exports = function (app) {
    app.use(cors());
    // Turn on JSON body parsing for REST services
    app.use(express.json());
    // Turn on URL-encoded body parsing for REST services
    app.use(express.urlencoded({extended: true}));
    // Set up REST transport using Express
    app.configure(express.rest());
    // Configure the Socket.io transport
    app.configure(socketio());
};