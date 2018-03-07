"use strict";

module.exports = function (req, res, next) {

    const Base = require('../controllers/base.class');
    const config = require('../../config/env');

    // Get controller/action
    Object.assign(req, Base.getControllerAction(req.baseUrl));

    // Check maintenance mode
    if (config.maintenance && req.action !== 'maintenance') {
        return res.redirect('/maintenance')
    }

    // Set config in req
    req.config = config;

    // Set config for view
    res.locals.controllers = config.app.controllers;
    res.locals.actions = config.app.actions;
    res.locals.color_theme = config.ui.color_theme;
    res.locals.logo_img = config.personal_data.logo_img;
    res.locals.copyright = config.personal_data.copyright;

    // Check env.js
    Base.isEnvJs();

    if (config.debug) {
        console.log('ini-app.middleware - OK.')

        // console.log('req.baseUrl: ', req.baseUrl);
        // console.log('req.path: ', req.path);
        // console.log('req.params: ', req.params);
        //
        // console.log('getControllerAction: ', req.controller, req.action);
    }

    next()
};