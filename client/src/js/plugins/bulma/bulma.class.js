"use strict";

import Highlight from '../highlight/highlight.class'

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
                const $deleteButton =  $deleteButtons[i];
                $deleteButton.addEventListener('click', function () {
                    // Get element for id
                    const $msg = document.getElementById(id);
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
                const $el =  $navbarBurgers[i];
                $el.addEventListener('click', function () {
                    // Get the target from the "data-target" attribute
                    const target = $el.dataset.target;
                    const $target = document.getElementById(target);
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
                const $el =  $elms[i];
                _isClass = $el.classList.contains(className);
            }
        }
        return _isClass;
    }

    showMessage(data){
        const $msg = document.getElementById(this.opts.idMsgBox);
        if($msg){
            // Render twig template
            const template = require('../../tmpls/layouts/message.html.twig');
            const html = template(data);
            $msg.innerHTML = html;
            if(this.isClass(`#${this.opts.idMsgBox}`, 'is-hidden')){
                $msg.classList.toggle('is-hidden');
            }
            this.initMessage(this.opts.idMsgBox);
        }
    }

    showError(data){
        const $msg = document.getElementById(this.opts.idMsgBox);
        if($msg){
            // Render twig template
            const template = require('../../tmpls/layouts/error.html.twig');
            const html = template(data);
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
                    const $el =  $elms[i];
                    const _message =  $el.innerHTML;
                    $el.innerHTML = _message +  message;
                    if(self.isClass(`#${self.opts.idMsgBox}`, 'is-hidden')){
                        $msg.classList.toggle('is-hidden');
                    }
                }
            }
        }
    }

    removeClass(query, classForRemove) {
        // Get all elements for query
        const $elms = Array.prototype.slice.call(document.querySelectorAll(query), 0);
        // Check if there are any query items
        if ($elms.length > 0) {
            // Remove class
            $elms.forEach(function ($el) {
                if($el.classList.contains(classForRemove)){
                    $el.classList.remove(classForRemove);
                }
            });
            for (let i = 0, len = $elms.length; i < len; i++) {
                const $el =  $elms[i];
                if($el.classList.contains(classForRemove)){
                    $el.classList.remove(classForRemove);
                }
            }
        }
    }
}

export default Bulma
