"use strict";

class Base {
    constructor(client) {
        this.client = client ? client : {};
    }

    /**
     * Render Twig template
     * @param filePath String
     * @param data {*}
     * @return String | Error
     */
    // async twigRender(filePath, data) {
    //     const template = require(filePath);
    //     return template(data);
    // }
}

export default Base
