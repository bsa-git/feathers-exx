"use strict";

const logger = require('morgan');
const unhandledRejection = require("unhandled-rejection");

// Assuming `loggingServer` is some kind of logging API...

let rejectionEmitter = unhandledRejection({
    timeout: 20
});

rejectionEmitter.on("unhandledRejection", (error, promise) => {
    logger.error('Unhandled Rejection at:', promise);
});