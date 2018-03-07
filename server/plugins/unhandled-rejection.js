"use strict";

const unhandledRejection = require("unhandled-rejection");

// Assuming `loggingServer` is some kind of logging API...

let rejectionEmitter = unhandledRejection({
    timeout: 20
});

rejectionEmitter.on("unhandledRejection", (error, promise) => {
    console.log('Unhandled Rejection at:', promise);
});

rejectionEmitter.on("rejectionHandled", (error, promise) => {
    console.log('Rejection Handled at:', promise);
})