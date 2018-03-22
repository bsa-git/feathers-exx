const { BadRequest } = require('@feathersjs/errors');

const validate = async context => {
    const { data } = context;

    // Check if there is `text` property
    if(!data.text) {
        throw new BadRequest('Message text must exist');
    }

    // Check if it is a string and not just whitespace
    if(typeof data.text !== 'string' || data.text.trim() === '') {
        throw new BadRequest('Message text is invalid');
    }

    // Change the data to be only the text
    // This prevents people from adding other properties to our database
    context.data = {
        text: data.text.toString()
    };

    return context;
};

module.exports = validate;