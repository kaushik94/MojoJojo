/*jslint node: true */
'use strict';

var settings = require('./config'),
    REDIS_URL = settings.REDIS_URL;

var parsers = require('./parsers/parsers'),
	senders = require('./middleware/senders');
//	logger = require('./logger');

// Set up connection to Redis
var redis;
if (REDIS_URL) {
	redis = require('redis').createClient(REDIS_URL);
} else {
	redis = require('redis').createClient();
}

var form = {
	"title": "HELLO WORLD",
	"base_price": "50.00",
	"currency": "INR",
	"description": "This is an example link."
};

(function() {

		redis.subscribe("tweets");

		redis.on("message", function(channel, message){
		  // pops off new item
		  parsers.instamojo(message, function(result){
		  		senders.instamojo(result, function(res){
		  			// logger.debug(res);
		  			console.log(res);	
		  		});
		  });

		});

})();