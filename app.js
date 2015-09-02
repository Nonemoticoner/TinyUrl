// Libraries
var express = require('express');
var bodyParser = require('body-parser');

// Express setup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// VARIABLES:
// AUTH_KEY for preventing unauthorized creations of links - CHOOSE YOURSELF (string)
// If AUTH_KEY remains undefined, then there is no need to authenticate.
var AUTH_KEY = undefined;

// A letter (or word) that is going to indicate that the link is a redirect
var LETTER = "fwd";

/*
 * CREATE -----------------------------------------------------------------------------------------------------------------
 */
/*
 * Example:
 * url: https://example.com
 * auth_key: qw34rfssw34tg4f33e
 * keyword: web
 * 
 * Resultant redirect link: http://<your_domain>/<LETTER>/<KEYWORD>
 */
app.get('/create', function (req, res) {
	var url = req.query.url,
		auth_key = (req.query.auth_key == undefined || req.query.auth_key == '') ? undefined : req.query.auth_key
		keyword = (req.query.keyword == undefined || req.query.keyword == '') ? undefined : req.query.keyword;

	// here more code soon
	// ...
});

/*
 * HOME -----------------------------------------------------------------------------------------------------------------
 */
app.get('/', function (req, res) {
	res.send('TinyUrl by Nonemoticoner. All rights reserved. &copy; 2015');
});

/*
 * APP RUN --------------------------------------------------------------------------------------------------------------
 */
var server =app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('TinyUrl server is listening at http://%s:%s', host, port);
});