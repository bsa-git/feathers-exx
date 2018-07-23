"use strict";

/**
 * Module dependencies.
 */
const app = require('./app.server');
const debug = require('debug')('app:server');
const http = require('http');
require('./plugins/unhandled-rejection');

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(app.get('port'));
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    debug('App is running at %s:%d in %s mode', app.get('host'), app.get('port'), app.get('env'));
    debug('Press CTRL-C to stop');
}