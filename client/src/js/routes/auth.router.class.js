"use strict";

import Auth from '../controllers/auth.class'

class AuthRouter {
    constructor(client) {
        this.client = client
        this.auth = new Auth(client);
    }
}
export default AuthRouter