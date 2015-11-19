/*jslint node: true */
'use strict';

var settings = require('./config.js'),
    REDIS_URL = settings.REDIS_URL;

var parsers = require('./parsers/parser.js');
		// Set up connection to Redis
var redis;
if (REDIS_URL) {
	redis = require('redis').createClient(REDIS_URL);
} else {
	redis = require('redis').createClient();
}

(function() {

		redis.subscribe("tweets");

		redis.on("message", function(channel, message){
		  // pops off new item
		  parsers.instamojo(message, function(text){
		  		console.log(text);
		  });

		});

})();