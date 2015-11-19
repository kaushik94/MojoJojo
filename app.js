/*jslint node: true */
'use strict';
// require('babel/register');
// Get dependencies
var settings = require('./app/config'),
    REDIS_URL = settings.REDIS_URL,
    port = settings.http.port;

var express = require('express'),
    app = express(),
  	compression = require('compression'),
  	morgan = require('morgan'),
    worker = require('./app/worker'),
    pusher = require('./app/pusher');

// Set up logging
app.use(morgan('combined'));

// Compress responses
app.use(compression());

// Listen
var io = require('socket.io')({
}).listen(app.listen(port));

console.log("Listening on port " + port);
// Handle connections