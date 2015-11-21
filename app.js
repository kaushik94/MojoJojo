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

worker.collect(params);

pusher.push();

logger.info("Listening on port " + port);