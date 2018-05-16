"use strict";

import hljs from 'highlight.js'
// import 'highlight.js/styles/xcode.css'

class Highlight {
    constructor(options) {
        const _options = options ? options : {};
        hljs.configure(_options);
    }

    static initBlock(query) {
        const _query = query ? query : '.highlight';
        const $els = document.querySelectorAll(_query);
        if ($els.length > 0) {
            for (let i = 0, len = $els.length; i < len; i++) {
                const $el =  $els[i];
                hljs.highlightBlock($el);
            }
        }
    }

    static init() {
        hljs.initHighlighting();
    }
}


export default Highlight
