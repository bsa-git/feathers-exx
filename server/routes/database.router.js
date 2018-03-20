"use strict";

const express = require('express');
const router = express.Router();
const config = require('../../config/env');
const Base = require('../controllers/base.class');
const Database = require('../controllers/database.class');

// GET database listing.
router.get('/about', function (req, res, next) {
    const context = {
        title: 'Feathers Database',
        req: req
    };
    if (config.debug) {
        console.log('Router.get: ', req.originalUrl);
    }
    // View render
    res.render('tmpls/database/about/index.html.twig', context);
    if (config.debug) {
        console.log(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
    }
});

router.get('/feathers-memory', async function (req, res, next) {
    try {
        const context = {
            title: 'Database in memory',
            req: req
        };
        if (config.debug) {
            console.log('Router.get: ', req.originalUrl);
        }
        // Create controller
        const db = new Database(context);
        // Perform the action "service.startServer"
        const messages = await db.feathersMemory();

        // Render twig template
        const html = await Base.twigRender('messages.html.twig', req, messages);
        // Set view params
        res.locals.msgBox = {type: 'info', text: html};
        // View render
        res.render('tmpls/database/feathers-memory/index.html.twig', context);
        if (config.debug) {
            console.log(`Result: "OK"; Controller: "${req.controller}"; Action: "${req.action}";`);
        }
    } catch
        (ex) {
        Base.showError(ex, req, res);
    }
});

module.exports = router;
