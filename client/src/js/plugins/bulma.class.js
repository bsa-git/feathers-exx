"use strict";

import Highlight from './highlight.class'

class Bulma {
    constructor(options) {
        this.opts = {
            idMsgBox: 'message-box',
            idMsgError: 'message-error',
            queryNavbarBurgers: '.navbar-burger',
        };
        Object.assign(this.opts, options);
    }

    init() {
        // Init Navbar Burgers
        this.initNavbarBurgers(this.opts.queryNavbarBurgers);
        // Init Message
        this.initMessage(this.opts.idMsgBox);
        this.initMessage(this.opts.idMsgError);
        // Init Highlight
        Highlight.initBlock('pre code');
        return this;
    }

    initMessage(id) {
        const $deleteButtons = Array.prototype.slice.call(document.querySelectorAll(`#${id} button.delete`), 0);
        if ($deleteButtons.length > 0) {
            // Add a click event on each of them
            for (let i = 0, len = $deleteButtons.length; i < len; i++) {
                let $deleteButton =  $deleteButtons[i];
                $deleteButton.addEventListener('click', function () {
                    // Get element for id
                    let $msg = document.getElementById(id);
                    // Add class 'is-hidden'
                    $msg.classList.add('is-hidden');
                });
            }
        }
    }

    initNavbarBurgers(query) {
        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(query), 0);
        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {
            // Add a click event on each of them
            for (let i = 0, len = $navbarBurgers.length; i < len; i++) {
                let $el =  $navbarBurgers[i];
                $el.addEventListener('click', function () {
                    // Get the target from the "data-target" attribute
                    let target = $el.dataset.target;
                    let $target = document.getElementById(target);
                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
                });
            }
        }
    }

    isClass(query, className) {
        let _isClass = false;
        // Get all elements for query
        const $elms = Array.prototype.slice.call(document.querySelectorAll(query), 0);
        // Check if there are any query items
        if ($elms.length > 0) {
            // Is class
            for (let i = 0, len = $elms.length; i < len; i++) {
                let $el =  $elms[i];
                _isClass = $el.classList.contains(className);
            }
        }
        return _isClass;
    }

    showMessage(data){
        const $msg = document.getElementById(this.opts.idMsgBox);
        if($msg){
            // Render twig template
            const template = require('../tmpls/layouts/message.html.twig');
            const html = template(data);
            $msg.innerHTML = html;
            if(this.isClass(`#${this.opts.idMsgBox}`, 'is-hidden')){
                $msg.classList.toggle('is-hidden');
            }
            this.initMessage(this.opts.idMsgBox);
        }
    }

    showError(err){
        const $msg = document.getElementById(this.opts.idMsgBox);
        if($msg){
            // Set error values
            err.code = err.code || err.status || 500;
            err.type = err.type || err.statusText || 'Request Error';
            err.stack = process.env.NODE_ENV === 'development' ? err.stack : '';
            err.request_info = err.request_info ? err.request_info : '';
            err.response_data = err.response_data ? err.response_data : '';

            // Render twig template
            const template = require('../tmpls/layouts/error.html.twig');
            const html = template({error: err});
            $msg.innerHTML = html;
            if(this.isClass(`#${this.opts.idMsgBox}`, 'is-hidden')){
                $msg.classList.toggle('is-hidden');
            }
            this.initMessage(this.opts.idMsgBox);
        }
    }

    addMessage(message){
        const self = this;
        //----------------------
        const $msg = document.getElementById(this.opts.idMsgBox);
        if($msg){
            // Get "message-body" element
            const $elms = Array.prototype.slice.call(document.querySelectorAll(`#${this.opts.idMsgBox} .message-body .client-body`), 0);
            // Check if there are any query items
            if ($elms.length > 0) {
                // Add my message to message-box
                for (let i = 0, len = $elms.length; i < len; i++) {
                    let $el =  $elms[i];
                    let _message =  $el.innerHTML;
                    $el.innerHTML = _message +  message;
                    if(self.isClass(`#${self.opts.idMsgBox}`, 'is-hidden')){
                        $msg.classList.toggle('is-hidden');
                    }
                }
            }
        }
    }

    addListener(query, cb){
        const $elms = Array.prototype.slice.call(document.querySelectorAll(query), 0);
        if ($elms.length > 0) {
            // Add a click event on each of them
            for (let i = 0, len = $elms.length; i < len; i++) {
                let $elm =  $elms[i];
                $elm.addEventListener('click', cb);
            }
        }
    }

    removeClass(query, classForRemove) {
        // Get all elements for query
        const $elms = Array.prototype.slice.call(document.querySelectorAll(query), 0);
        // Check if there are any query items
        if ($elms.length > 0) {
            // Remove class
            for (let i = 0, len = $elms.length; i < len; i++) {
                let $el =  $elms[i];
                if($el.classList.contains(classForRemove)){
                    $el.classList.remove(classForRemove);
                }
            }
        }
    }
}

export default Bulma
