'use strict';

// Get dependencies
var Twitter = require('twitter'),
    _ = require('lodash');

// Fetches tweets in this interval(15 mins)
// This is the official twitter rate limit
// for their REST API.
// https://dev.twitter.com/rest/public/rate-limiting
var TIMEOUT = 15*60;

var settings = require('./config'),
    TWITTER_CONSUMER_KEY = settings.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET = settings.TWITTER_CONSUMER_SECRET,
    TWITTER_ACCESS_TOKEN_KEY = settings.TWITTER_ACCESS_TOKEN_KEY,
    TWITTER_ACCESS_TOKEN_SECRET = settings.TWITTER_ACCESS_TOKEN_SECRET,
    REDIS_URL = settings.REDIS_URL;

// Set up Twitter client
var client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

// Set up connection to Redis
var redis;
if (REDIS_URL) {
  redis = require('redis').createClient(REDIS_URL);
} else {
  redis = require('redis').createClient();
}

var worker = (function(){

    var collect = function(params){
      client.stream('statuses/filter', params, function(stream) {
        stream.on('data', function(tweet) {
          redis.publish('tweets', tweet.text);
          redis.rpush('stream:tweets', tweet.text);
        });

      });
    };

    return {
      collect
    };

})();

module.exports = worker;