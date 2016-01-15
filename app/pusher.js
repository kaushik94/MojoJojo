/*jslint node: true */
'use strict';

var settings = require('./config'),
    REDIS_URL = settings.REDIS_URL;

var parsers = require('./parsers/parsers'),
    senders = require('./middleware/senders');

// Set up connection to Redis
var redis;

if (REDIS_URL) {
	redis = require('redis').createClient(REDIS_URL);
} else {
	redis = require('redis').createClient();
}

var pusher = (function() {

	var push = function(){
		redis.subscribe("tweets");

		redis.on("message", function(channel, message){
		  // pops off new item
		  console.log(message);
		  parsers.instamojo(message, function(result){
		  		senders.instamojo(result, function(res){
		  			console.log(res);
		  			console.log(result);	
		  		});
		  });

		});
	};

	return {
		push
	};

})();

module.exports = pusher;
