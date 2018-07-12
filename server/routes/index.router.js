"use strict";

const express = require('express');
const router = express.Router();
const debug = require('debug')('app:index.router');

/* GET 'home' page. */
router.get('/', function (req, res, next) {
    const context = {
        title: 'Feathers Features',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/index/index/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

/* GET 'maintenance' page. */
router.get('/maintenance', function (req, res, next) {
    const context = {
        title: 'Maintenance',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/index/maintenance/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

module.exports = router;
