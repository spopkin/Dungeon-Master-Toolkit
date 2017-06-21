//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var sqlDB = require('mariasql');
var fs = require('fs');

var dbConfig = null;

function cliHandler() {

}

//Prepare the rest api
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.redirect('/charsheet-tool.html');
});

app.listen(8080, function() {
	console.log('listening on port 8080');
});
