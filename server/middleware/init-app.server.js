"use strict";

module.exports = function (req, res, next) {

    const Base = require('../controllers/base.class');
    const config = require('../../config/app.config');
    const debug = require('debug')('app:middleware.init');

    // Get controller/action
    Object.assign(req, Base.getControllerAction(req.path));

    // Check maintenance mode
    if (config.maintenance && req.action !== 'maintenance') {
        return res.redirect('/maintenance')
    }

    // Set config in req
    // req.config = config;

    // Set values for view
    res.locals.req = req;
    res.locals.controllers = config.controllers;
    res.locals.actions = config.actions;
    res.locals.color_theme = config.color_theme;
    res.locals.logo_img = process.env.PERSONAL_LOGO_IMAGE;
    res.locals.contact_website = process.env.PERSONAL_WEBSITE;
    res.locals.copyright = process.env.PERSONAL_COPYRIGHT;

    // Check .env
    if(req.app.get('env') === 'development'){
        Base.isEnvJs();
    }

    next()
};