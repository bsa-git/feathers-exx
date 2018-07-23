// server/boot/index.js

module.exports = function (app) {
    require("./express")(app);
    require("./rest")(app);
    require("./channel")(app);
};