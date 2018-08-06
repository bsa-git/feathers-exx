"use strict";

import Base from './base.client.class'

class Auth extends Base {
    constructor(context) {
        super(context);
    }

    /**
     * Action auth chat
     * @return Promise
     */
    async chat() {
        // Set rest transport
        const app = this.setRestTransport();

    }
}

module.exports = Auth;
