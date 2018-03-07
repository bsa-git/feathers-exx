'use strict';

import LocationHelper from 'location-helper'

class Location extends LocationHelper {
    constructor(url) {
        super(url);
        this.pathname = this.pathname.startsWith('/') ? this.pathname.slice(1) : this.pathname;
        this.controller = this._getControllerAction().controller;
        this.action = this._getControllerAction().action;
    }

    /**
     * Get controller/action
     * @return Object
     */
    _getControllerAction() {
        let controller, action;
        const arrPathName = this.pathname ? this.pathname.split('/') : [];
        if (arrPathName.length === 0) {
            controller = 'index';
            action = 'index';
        } else if (arrPathName.length === 1) {
            controller = 'index';
            action = arrPathName[0];
        } else {
            controller = arrPathName[0];
            action = arrPathName[1];
        }
        return {controller, action}
    }
}

export default Location
