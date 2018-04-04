"use strict";

const mongooseOptions = context => {
    // Set sequelize property which allows to pass additional Sequelize options
    if (!context.params.mongoose) {
        context.params.mongoose = {};
    }
    // Set some additional Mongoose options
    // The adapter tries to use sane defaults
    // but they can always be changed here
    Object.assign(context.params.mongoose, {
        runValidators: true,
        setDefaultsOnInsert: true
    });
    return context
};

module.exports = {
    before: {
        create: [mongooseOptions],
        update: [mongooseOptions],
        patch: [mongooseOptions]
    }
};