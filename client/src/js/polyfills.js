const debug = require('debug')('app:polyfills');

if(!('assign' in Object)){
    require('babel-polyfill');
    debug('Added  babel-polyfill.js');
}

// if(!('fetch' in window)){
//     require('fetch-polyfill');
//     debug('Added  fetch-polyfill.js');
// }
