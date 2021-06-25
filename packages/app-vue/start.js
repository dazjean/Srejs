require('@babel/register')({
    presets: ['@babel/env']
});
require('core-js/stable');
require('regenerator-runtime');
module.exports = require('./app.js');
