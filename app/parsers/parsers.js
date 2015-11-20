'use strict';

var _ = require('lodash'),
	fs = require('fs'),
	parser = require('concepts-parser'),
	async = require('async'),
	twitter_text = require('twitter-text');

var contents = fs.readFileSync("./currencies.json"),
 	currencies = JSON.parse(contents),
	defaultCurrency = "INR";

var parsers = (function(){


	var normalize = function(text, result, callback){
		// remove @someone
		// remove hashtags
		callback(null, text, result);
	};

	var isCost = function(value){
		value = parseInt(value);
		return !isNaN(value);
	};

	var isCurrency = function(string){
		if(currencies[string])
			return currencies[string];
		return false;
	};

	var currencyExtractor = function(text, result, callback){
		var words = text.split(" ");
		_.forEach(words, function(n){
			var currency = isCurrency(n);
			if(currency){
				result.currency = currency;
				if(result.cost)
					callback(null, text, result);
				var approx = words.indexOf(currency);
				if(words[approx+1] && isCost(words[approx+1])){
					result.cost = words[approx+1];
					callback(null, text, result)
				}
				if(words[approx-1] && isCost(words[approx-1])){
					result.cost = words[approx-1];
					callback(null, text, result);
				}
			}
		});
		return;
	};

	var defaultTitle = function(text, result, callback){
		if(result.title)
			callback(null, text, result);
		var words = text.split(" ");
		result.title = words[0];
		callback(null, text, result)
	};

	var costExtractor = function(text, result, callback){
		var words = text.split(" "),
			costs = words.indexOf("costs"),
			cost = words.indexOf("cost");
		if(costs){
			if(words[costs+1] && isCost(words[costs+1])){
				result.cost = words[costs+1];
			}
			if(words[costs-1]){
				if(_.contains(
					['which', 'that', 'and', 'also', 'it'],
					words[costs-1])){
					words.splice(costs-1, 1);
				}
			}
			words.splice(costs, 1);
		}
		if(cost){
			if(words[costs+1] && isCost(words[costs+1])){
				result.cost = words[cost+1];
			}
			words.splice(cost, 1);
		}
		callback(null, text, result);
	};

	var titleExtractor = function(tweet, result, callback){
		var title = parser.parse({
			text: tweet,
			country:'us',
			lang:'en'
		});
		if(title.length){
			result.title = title[0]['value'];
			callback(null, tweet, result);
		}
		else{
			defaultTitle(text, result, callback);
		}
	};

	var descriptionExtractor = function(text, result, callback){
		result.description = text;
		callback(null, text, result);
	};

	var finalizer = function(text, result, callback){
		callback(null, text, result);
	}

	var instamojoParser = function(text, callback){
		
		var result = {
			title: '',
			description: '',
			cost: '',
			currency: ''
		};

		async.waterfall([
		  function(cb){
		  		cb(null, text, result);
		  },
		  normalize,
		  costExtractor,
		  currencyExtractor,
		  titleExtractor,
		  descriptionExtractor,
		  finalizer
		], function (err, text, result) {
			if(!err)
		  		callback(result);
		});
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