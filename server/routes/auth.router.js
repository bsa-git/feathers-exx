"use strict";

const express = require('express');
const router = express.Router();
const Auth = require('../controllers/auth.server.class');
const debug = require('debug')('app:auth.router');

/* GET auth listing. */
router.get('/about', function (req, res, next) {
    const context = {
        title: 'Feathers Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/auth/about/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/server', function (req, res, next) {
    const context = {
        title: 'Server Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/auth/server/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

module.exports = router;
