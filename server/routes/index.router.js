"use strict";

const express = require('express');
const router = express.Router();
const config = require('../../config/env');

/* GET 'home' page. */
router.get('/', function (req, res, next) {
    const context = {
        title: 'Feathers Features',
        req: req
    };
    if (config.debug) {
        console.log('Router.get: ', req.originalUrl);
    }
    // View render
    res.render('tmpls/index/index/index.html.twig', context);
    if (config.debug) {
        console.log(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
});

/* GET 'maintenance' page. */
router.get('/maintenance', function (req, res, next) {
    const context = {
        title: 'Maintenance',
        req: req
    };
    if (config.debug) {
        console.log('Router.get: ', req.originalUrl);
    }
    // View render
    res.render('tmpls/index/maintenance/index.html.twig', context);
    if (config.debug) {
        console.log(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
});

module.exports = router;
