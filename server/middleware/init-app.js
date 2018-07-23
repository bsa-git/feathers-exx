"use strict";

module.exports = function (req, res, next) {

    const Base = require('../controllers/base.server.class');

    // Get controller/action
    Object.assign(req, Base.getControllerAction(req.path));

    // Check maintenance mode
    if ( req.app.get('maintenance') && req.action !== 'maintenance') {
        return res.redirect('/maintenance')
    }

    // Set values for view
    res.locals.port = req.app.get('port');
    res.locals.req = req;
    res.locals.controllers = req.app.get('controllers');
    res.locals.actions = req.app.get('actions');
    res.locals.color_theme = req.app.get('color_theme');
    res.locals.logo_img = req.app.get('personal')['logo_image'];
    res.locals.contact_website = req.app.get('personal')['website'];
    res.locals.copyright = req.app.get('personal')['copyright'];

    // Check .env
    if(req.app.get('env') === 'development'){
        Base.isEnvJs();
    }

    next()
};