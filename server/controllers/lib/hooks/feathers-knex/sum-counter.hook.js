"use strict";

module.exports = (context) => {
    // Returns a KnexJS query with the common filter criteria (without pagination) applied
    let query = context.service.createQuery(context.params);

    // do something with query here
    query.sum('counter as sum_counter');
    context.params.knex = query;
    return context;
};