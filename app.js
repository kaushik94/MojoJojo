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

logger.info("Listening on port " + port);

var message = "Text Books for children illustrating cartoons, costs 1 $ a piece"
var parsers = require('./app/parsers/parsers');
var senders = require('./app/middleware/senders');
parsers.instamojo(message, function(result){
	logger.debug(result);
});
