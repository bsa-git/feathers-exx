"use strict";

const mongodbOptions = context => {
    // Set mongodb property which allows to pass additional mongodb options
    if (!context.params.mongodb) {
        context.params.mongodb = {};
    }
    // Set some additional Mongodb options
    // The adapter tries to use sane defaults
    // but they can always be changed here
    Object.assign(context.params.mongodb, {
        // runValidators: true,
        // setDefaultsOnInsert: true
    });
    return context
};

module.exports = mongodbOptions;