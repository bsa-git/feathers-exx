"use strict";

const express = require('express');
const router = express.Router();
const Base = require('../controllers/base.server.class');
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

router.get('/chat', function (req, res, next) {
    const context = {
        title: 'Chat Application',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/auth/chat/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/server', async function (req, res, next) {
    const context = {
        title: 'Server Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);

    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};
    // View render
    res.render('tmpls/auth/server/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/client', async function (req, res, next) {
    const context = {
        title: 'Client Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/client/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

module.exports = router;
