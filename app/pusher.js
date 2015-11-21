/*jslint node: true */
'use strict';

var settings = require('./config'),
    REDIS_URL = settings.REDIS_URL;

var parsers = require('./parsers/parsers'),
	senders = require('./middleware/senders');


var pusher = (function() {

	// Set up connection to Redis
	var redis;
	
	var connect = function(){
		if (REDIS_URL) {
			redis = require('redis').createClient(REDIS_URL);
		} else {
			redis = require('redis').createClient();
		}
	};

	var push = function(){
		redis.subscribe("tweets");

		redis.on("message", function(channel, message){
		  // pops off new item
		  parsers.instamojo(message, function(result){
		  		senders.instamojo(result, function(res){
		  			logger.debug(res);
		  			logger.debug(result);	
		  		});
		  });

		});
	};

	return {
		connect,
		push
	};

})();

module.exports = pusher;