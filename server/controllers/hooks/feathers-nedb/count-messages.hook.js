"use strict";

module.exports = async (context) => {
    return new Promise(function (resolve, reject) {
        // Get MeDB model
        const model = context.service.Model;
        // Count all documents in the datastore
        model.count({}, function (err, count) {
            if (err) {
                reject(err);
            }
            context.result = count;
            resolve(context);
        });
    });
};