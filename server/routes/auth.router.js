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

router.get('/local', async function (req, res, next) {
    const context = {
        title: 'Local Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/local/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/jwt', async function (req, res, next) {
    const context = {
        title: 'JWT Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/jwt/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/oauth1', async function (req, res, next) {
    const context = {
        title: 'OAuth1 Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/oauth1/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/oauth1-ok', async function (req, res, next) {
    const context = {
        title: 'OAuth1 Authentication OK',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/oauth1/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/oauth2', async function (req, res, next) {
    const context = {
        title: 'OAuth2 Authentication',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/oauth2/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/oauth2-ok', async function (req, res, next) {
    const context = {
        title: 'OAuth2 Authentication OK',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('auth.html.twig', req, {});
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};

    // View render
    res.render('tmpls/auth/oauth2/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

module.exports = router;
