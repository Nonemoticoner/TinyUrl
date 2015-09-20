/**
 * Tiny Url
 * https://github.com/Nonemoticoner/TinyUrl
 *
 * Copyright (c) 2015 Nonemoticoner
 * Licensed under the MIT license.
 */

// Libraries
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var pc = require('password-creator');

// Express setup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Password-Creator preferences - YOU CAN CHOOSE YOURSELF
// This will define how links will look if not keyword specified
var pc_config = {
	sets: {
		letters: true,
		lowercase: true,
		uppercase: false,
		digits: true,
		special: false,
		space: false,
		exclude: ""
	},
	length: 5
};

// MySQL connection setup
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'tinyurl',
	password: 'password',
	multipleStatements: true
});

connection.query('USE TinyUrl');

// VARIABLES:
// AUTH_KEY for preventing unauthorized creations of links - CHOOSE YOURSELF (string)
// If AUTH_KEY remains undefined, then there is no need to authenticate.
var AUTH_KEY = undefined;

// A letter (or word) that is going to indicate that the link is a redirect
var LETTER = "fwd";

// function for making rand keyword different than other
function createRandom (taken) {
	var keyword, 
		isFree = false;

	while(!isFree){
		isFree = true;

		keyword = pc.create(pc_config);

		for (var i = taken.length - 1; i >= 0; i--) {
			if(taken[i].keyword == keyword)
				isFree = false;
		}
	}

	return keyword;
}


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
app.post('/create', function (req, res) {console.log("create req");
	var url = req.query.url,
		auth_key = (req.query.auth_key == undefined || req.query.auth_key == '') ? undefined : req.query.auth_key,
		keyword = (req.query.keyword == undefined || req.query.keyword == '') ? undefined : req.query.keyword;

	if(auth_key == AUTH_KEY){
		// create keyword if not specified
		var makeRandom = false;

		if(typeof keyword == "undefined"){
			makeRandom = true;
		}

		// check if randed keyword doesn't already exist in database
		connection.query("SELECT keyword FROM Links;", function (err, rows, fields) {
			var isFree = true;

			if (err) {
				throw err;
				res.status(500).send("Database error!");
			}
			else{
				// if already exists
				if(!makeRandom){
					for (var i = rows.length - 1; i >= 0; i--) {
						if(rows[i].keyword === keyword)
							isFree = false;
					}
				}
				else{
					keyword = createRandom(rows);
				}

				if(isFree){
					// post new record to db
					connection.query("INSERT INTO Links (keyword, url) VALUES ('" + keyword + "', '" + url + "');", function (err, rows, fields) {
						if (err) {
							throw err;
							res.status(500).send("Database error!");
						}
						else{
							res.status(201).send("New redirect link has been successfully created!");
						}
					});
				}
				else{
					// overwrite to prevent double
					connection.query("UPDATE Links SET url='" + url + "' WHERE keyword='" + keyword + "';", function (err, rows, fields) {
						if (err) {
							throw err;
							res.status(500).send("Database error!");
						}
						else{
							res.status(201).send("Redirect link has been successfully overwritten!");
						}
					});

				}
			}
		});
	}
	else{
		res.status(401).send("Wrong auth key!");
	}

});

/*
 * REDIRECT -------------------------------------------------------------------------------------------------------------
 */
app.get('/' + LETTER + '/:id', function (req, res) {
	var id = req.params.id;
	
	// request data from db
	connection.query("SELECT url FROM Links WHERE keyword='" + id + "';", function (err, rows, fields) {
		if (err) throw err;
		
		if(rows.length == 0){
			res.status(404).send("<h1>404 - Not Found</h1>");
		}
		else{
			res.redirect(rows[0].url);
		}
	});
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
var server = app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('TinyUrl server is listening at http://%s:%s', host, port);
});