"use strict";

const express = require('express');
const router = express.Router();
const config = require('../../config/env');
const Auth = require('../controllers/auth.class');

/* GET auth listing. */
router.get('/about', function (req, res, next) {
    const context = {
        title: 'Feathers Auth',
        req: req
    };
    if (config.debug) {
        console.log('Router.get: ', req.originalUrl);
    }
    // View render
    res.render('tmpls/auth/about/index.html.twig', context);
    if (config.debug) {
        console.log(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
});

module.exports = router;
