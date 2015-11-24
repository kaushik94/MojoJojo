/*jslint node: true */
'use strict';

var settings = require('./app/config'),
    REDIS_URL = settings.REDIS_URL,
    port = settings.http.port;

var express = require('express'),
    app = express(),
    fs = require('fs'),
    requirejs = require('requirejs');

var worker = require('./app/worker'),
    pusher = require('./app/pusher'),
    logger = require('./logger');

var params = {
	track: '@instamojojo'
};

requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require
});

// Start collecting tweets
worker.collect(params);

// Initiate the pusher
pusher.push();

app.set('port', settings.http.port);

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});