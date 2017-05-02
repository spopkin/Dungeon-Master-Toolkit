//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
//var fs = require('fs');
var fs = require('./fswrapper.js');
//var pdflib = require('pdf-text-extract');


//current user's id
var userID = 0;


function cliHandler() {

}


//Run setup tasks
cliHandler();
var config = fs.parseConfig();
console.log(config);
fs.configureRuleBookDir(config);


//Prepare to rest
var app = express();
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    //res.send('Index')
    res.redirect('/pdf-rulefind.html');
});


app.get('/search', function(req, res) {
    console.log("books list: " + req.query.books);
    console.log("keywords list: " + req.query.keywords);
    res.send('Search');
});


app.get('/books', function(req, res) {
    //var jsonContents = JSON.stringify(fs.getAllAllowedBooks(userID, config));
    var jsonContents = fs.getAllAllowedBooks(userID, config);
    console.log("returning book list:");
    console.log(jsonContents);
    res.send(jsonContents);
});


console.log('Started');
console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
