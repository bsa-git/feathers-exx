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
// server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
// function onError(error) {
//     if (error.syscall !== 'listen') {
//         throw error;
//     }
//
//     const bind = typeof port === 'string'
//         ? 'Pipe ' + port
//         : 'Port ' + port;
//
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//         case 'EACCES':
//             console.error(bind + ' requires elevated privileges');
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(bind + ' is already in use');
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    // const addr = server.address();
    // const bind = typeof addr === 'string'
    //     ? 'pipe ' + addr
    //     : 'port ' + addr.port;
    // const address = server.address();
    debug('App is running at %s:%d in %s mode', app.get('host'), app.get('port'), app.get('env'));
    debug('Press CTRL-C to stop');
}