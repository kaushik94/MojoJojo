/*jslint node: true */
'use strict';

var settings = require('./app/config'),
    REDIS_URL = settings.REDIS_URL,
    port = settings.http.port;

var express = require('express'),
    app = express(),
    fs = require('fs');

var worker = require('./app/worker'),
    pusher = require('./app/pusher'),
    logger = require('./logger');

var params = {
	screen_name: 'the_AMAlive'
};

worker.connect();
worker.collect(params);

pusher.connect();
pusher.push();

logger.info("Listening on port " + port);