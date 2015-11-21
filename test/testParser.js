Music Player which has 32GB memory and costs 3000 INR
Papers which are 10mm thick and cost 5 INR each
Text Books for children illustrating cartoons, costs 1 USD a piece

var message = "Text Books for children illustrating cartoons, costs 1 $ a piece"
var parsers = require('./app/parsers/parsers');
var senders = require('./app/middleware/senders');
parsers.instamojo(message, function(result){
	logger.debug(result);
});