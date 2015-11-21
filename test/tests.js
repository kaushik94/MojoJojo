var parsers = require('../app/parsers/parsers'),
	assert = require('assert'),
	_ = require('lodash');

describe('Parsers', function() {
  var tweets = [
    {
    	tweet: "Music Player which has 32GB memory and costs 3000 INR",
    	expected: {
    		title: 'Music Player',
    		description: 'Music Player which has 32GB memory and costs 3000 INR',
    		base_price: '3000',
    		currency: 'INR' 
    	}
    },
    {
    	tweet: "Papers which are 10mm thick and cost 5 INR each", 
    	expected: {
    		title: 'Papers',
    		description: 'Papers which are 10mm thick and cost 5 INR each',
    		base_price: '5',
    		currency: 'INR' 
    	}
    },
    {
    	tweet: "Text Books for children illustrating cartoons, costs 1 USD a piece",
    	expected: {
    		title: 'Text Books',
    		description: 'Text Books for children illustrating cartoons, costs 1 USD a piece',
    		base_price: '1',
    		currency: 'USD' 
    	}
    },
    {
    	tweet: "Text Books for children illustrating cartoons, costs 1 $ a piece",
    	expected: {
    		title: 'Text Books',
    		description: 'Text Books for children illustrating cartoons, costs 1 $ a piece',
    		base_price: '1',
    		currency: 'USD' 
    	}
    },
    {
    	tweet: "Create Notebook which is a 50 page notebook of handmade paper and costs 10 INR",
    	expected: {
    		title: 'Create Notebook',
    		description: 'Create Notebook which is a 50 page notebook of handmade paper and costs 10 INR',
    		base_price: '10',
    		currency: 'INR' 
    	}
    }
  ];

  tweets.forEach(function(test) {
    it('parsing the tweet: '+test.tweet+'\n got: '+JSON.stringify(test.expected), function(done) {
		parsers.instamojo(test.tweet, function(result){
			assert(_.isEqual(result, test.expected));
			done();
		});      
    });
  });

});