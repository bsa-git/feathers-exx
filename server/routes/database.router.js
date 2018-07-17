"use strict";

const express = require('express');
const router = express.Router();
const Base = require('../controllers/base.server.class');
const Database = require('../controllers/database.server.class');
const HttpBox = require('../plugins/http.server.class');
const debug = require('debug')('app:database.router');

// GET database listing.
router.get('/about', function (req, res, next) {
    const context = {
        title: 'Feathers Database',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // View render
    res.render('tmpls/database/about/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/feathers-localstorage', async function (req, res, next) {
    const context = {
        title: 'Feathers LocalStorage DataBase',
        req: req
    };
    debug('Router.get: ', req.originalUrl);
    // Render twig template
    const html = await Base.twigRender('messages.html.twig', req);
    // Set view params
    res.locals.msgBox = {type: 'info', text: html};
    // View render
    res.render('tmpls/database/feathers-localstorage/index.html.twig', context);
    debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
});

router.get('/feathers-memory', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers Memory DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersMemory();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-memory/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-nedb', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers NeDB DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersNeDB();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-nedb/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});


router.get('/feathers-knex', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers Knex DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersKnex();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-knex/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-sequelize', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers Sequelize DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersSequelize();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-sequelize/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-mongoose', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers Mongoose DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersMongoose();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-mongoose/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-mongodb', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers MongoDB DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersMongoDB();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-mongodb/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-elasticsearch', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers ElasticSearch DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersElasticSearch();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-elasticsearch/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

router.get('/feathers-rethinkdb', async function (req, res, next) {
    try {

        const http = new HttpBox(req);

        const context = {
            title: 'Feathers RethinkDB DataBase',
            req: req
        };
        debug('Router.get: ', req.originalUrl);
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersRethinkDB();
        Object.assign(messages, {url: http.getHostAndPath()});
        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-rethinkdb/index.html.twig', context);
        debug(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    } catch (ex) {
        Base.showError(ex, req, res);
    }
});

module.exports = router;
