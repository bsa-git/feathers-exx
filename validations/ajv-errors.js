"use strict";

module.exports.getFormatErrors = (errors) => {
    const arrErrors = [];
    let message;

    errors.forEach(ajvError => {
        if (ajvError.dataPath) {
            message = `<strong>${ajvError.dataPath.substring(1)}</strong>: ${ajvError.message}`;
        } else {
            message = `${ajvError.message}`;
            if (ajvError.params && ajvError.params.additionalProperty) {
                message += `: '${ajvError.params.additionalProperty}'`;
            }
        }
        arrErrors.push(message);
    });
    return arrErrors;
};