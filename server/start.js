"use strict";

/**
 * Module dependencies.
 */
const debug = require('debug')('app:start');
const app = require('./app.server');

/**
 * Create HTTP server.
 */
const port = app.get('port');
const server = app.listen(port);

/**
 * Unhandled Rejection for Promise
  */
process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
);

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    debug('App is running at %s:%d in %s mode', app.get('host'), app.get('port'), app.get('env'));
    debug('Press CTRL-C to stop');
}