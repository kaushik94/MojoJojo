/*jslint node: true */
'use strict';

var request = require('request'),
	settings = require('../config');

var url = settings.INSTAMOJO_URL,
	headers = {
	    'X-Api-Key': settings.INSTAMOJO_API_KEY,
	    'X-Auth-Token': settings.INSTAMOJO_AUTH_TOKEN
  	};

// A wrapper to post data to instamojo
var connections = (function(){

	var instamojo = function(json, callback){
		request.post({
			form:json,
			url:url,
			headers:headers
		}, function(err, res, body){ 
			if(err)
				console.log(err);
			else
				console.log(res);
		});
	};

	return{
		instamojo
	};

})();

module.exports = connections;