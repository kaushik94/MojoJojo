'use strict';

function helpers(){

};

var parsers = (function(){

	var instamojoParser = function(text, callback){
		callback(text);
	};

	var plainParser = function(text, callback){
		callback(text);
	};

	return{
		instamojo: instamojoParser,
		plain: plainParser
	};

})();

module.exports = parsers;