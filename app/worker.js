'use strict';

// Get dependencies
var Twitter = require('twitter');

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

client.stream('statuses/filter', {track: 'javascript', lang: 'en'}, function(stream) {
  
  stream.on('data', function(tweet) {
    redis.publish('tweets', tweet.text);
    redis.rpush('stream:tweets', tweet.text);
  });
  stream.on('error', function (error) {
    console.log(error);
  });

});