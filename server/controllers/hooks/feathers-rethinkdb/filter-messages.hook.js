"use strict";

module.exports = async (context) => {
    return new Promise(function (resolve, reject) {
        const query = context.service.createQuery(context.params.query);
        context.params.rethinkdb = query.filter(function(doc) {
            return doc("tags").contains("7");
        });
        resolve(context);
    });
};