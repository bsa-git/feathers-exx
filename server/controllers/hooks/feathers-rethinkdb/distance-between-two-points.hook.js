"use strict";

module.exports = async (context) => {
    return new Promise(function (resolve, reject) {
        // Get rethink
        const rethink = context.service.options.Model;
        const point1 = rethink.point(-122.423246,37.779388);
        const point2 = rethink.point(-117.220406,32.719464);
        const distance = rethink.distance(point1, point2, {unit: 'km'});
        context.result = distance;
        resolve(context);
    });
};