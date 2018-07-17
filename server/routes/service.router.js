"use strict";

const express = require('express');
const router = express.Router();
const Base = require('../controllers/base.server.class');
const Service = require('../controllers/service.server.class');
const HttpBox = require('../plugins/http.server.class');
const debug = require('debug')('app:service.router');

// GET service listing.
router.get('/about', function (req, res, next) {
    const context = {
        title: 'Feathers Service',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/service/about/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/start-client', function (req, res, next) {
    const context = {
        title: 'Our first Feathers application on the client',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/service/start-client/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/start-server', async function (req, res, next) {
    const context = {
        title: 'Our first Feathers application on the server',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.startServer"
        const todo = await service.startServer('dishes');

        // Render twig template
        const html = await  Base.twigRender('todo.html.twig', req, todo);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/start-server/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/methods', async function (req, res, next) {
    const context = {
        title: 'Service methods',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.methods"
        const messages = await service.methods();

        // Render twig template
        const html = await  Base.twigRender('messages.html.twig', req, {messages});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/methods/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/events', async function (req, res, next) {
    const context = {
        title: 'Service events',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.methods"
        const events = await service.events();

        // Render twig template
        const html = await  Base.twigRender('events.html.twig', req, {events});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/events/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }

});

router.get('/hooks/:validate', async function (req, res, next) {//

    const context = {
        title: 'Hooks',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.hooks"
        const messages = await service.hooks();

        // Render twig template
        const html = await  Base.twigRender('messages.html.twig', req, {messages});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/hooks/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        // Base.showError(ex, req, res);
        // Render twig template
        const html = await  Base.twigRender('validate-error.html.twig', req, {error: ex});
        // Set view params
        res.locals.msgBox = {type: 'danger', text: html};
        // View render
        res.render('tmpls/service/hooks/index.html.twig', context);
    }
});

router.get('/rest-apis', async function (req, res, next) {

    const http = new HttpBox(req);

    const context = {
        title: 'REST APIs',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.restApis"
        const messages = await service.restApis();

        // Render twig template
        const html = await  Base.twigRender('messages.html.twig', req, {messages, url: http.getHostAndPath()});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/rest-apis/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }

});

router.get('/rest-client', async function (req, res, next) {

    const http = new HttpBox(req);

    const context = {
        title: 'REST Client',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.restApis"
        const messages = await service.restClient();

        // Render twig template
        const html = await  Base.twigRender('messages.html.twig', req, {messages, url: http.getHostAndPath()});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/rest-client/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }

});

router.get('/real-time', async function (req, res, next) {

    const http = new HttpBox(req);

    const context = {
        title: 'Real-time APIs',
        req: req,
        res: res
    };
    debug('Router.get: ', req.originalUrl);
    try {
        // Create controller
        const service = new Service(context);
        // Perform the action "service.restApis"
        const messages = await service.realTime();

        // Render twig template
        const html = await  Base.twigRender('messages.html.twig', req, {messages, url: http.getHostAndPath()});
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/service/real-time/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
    catch (ex) {
        Base.showError(ex, req, res);
    }

});

module.exports = router;
