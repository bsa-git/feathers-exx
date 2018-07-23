// server/boot/channel.js

module.exports = function (app) {
    // On any real-time connection, add it to the 'everybody' channel
    app.on('connection', connection => app.channel('everybody').join(connection));
    // Publish all events to the 'everybody' channel
    app.publish(() => app.channel('everybody'));

};