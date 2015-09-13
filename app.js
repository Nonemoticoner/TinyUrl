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
			keyword = pc.create(pc_config);

			makeRandom = true;
		}

		// check if keyword doesn't already exist in database
		var isFree = false;

		while(!isFree){
			connection.query("SELECT * FROM Links WHERE keyword='" + keyword + "';", function (err, rows, fields) {console.log("enter");
				if (err) {
					throw err;
					res.status(500).send("Database error!");
				}
				else{
					// if already exists
					if(rows[0].keyword == keyword){console.log(rows[0].keyword);
						// create another keyword
						if(makeRandom){
							keyword = pc.create(pc_config);
						}
						else{
							res.send("Such keyword is already in use!");
						}
						
					} 
					// if doesn't exist
					else{
						isFree = true;
					}
				}
			});
		}

		// post data to db
		var query = "INSERT INTO Links (keyword, url) VALUES ('" + keyword + "', '" + url + "');";

		connection.query(query, function (err, rows, fields) {
			if (err) {
				throw err;
				res.status(500).send("Database error!");
			}
			else{
				res.status(201).send("Redirect link successfully created!");
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
app.get('/' + LETTER + '/:id', function (req, res) {console.log("get req");
	var id = req.params.id;console.log("get id: " + id);
	
	// request data from db
	connection.query("SELECT url FROM Links WHERE keyword='" + id + "';", function (err, rows, fields) {
		if (err) throw err;
		
		if(typeof rows == "undefined"){//rows[0].url
			res.status(404).send("<h1>404 - Not Found</h1>");console.log("404");
		}
		else{
			res.redirect(rows[0].url);console.log("redirect");
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
var server =app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('TinyUrl server is listening at http://%s:%s', host, port);
});