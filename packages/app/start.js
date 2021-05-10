require('@babel/register')({
    presets: ['@babel/env','@babel/react']
});
require( "core-js/stable");
require("regenerator-runtime/runtime");
module.exports = require('./app.js');
