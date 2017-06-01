//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var async = require('async');
var fs = require('./fswrapper.js');
var wait = require('wait.for');
//var pdflib = require('pdf-text-extract');

//current user's id
var userID = 0;

// Process command line flags here (none yet)
function cliHandler() {

}


//Run setup tasks
cliHandler();
var config = fs.parseConfig();
console.log(config);
fs.configureRuleBookDir(config);
//fs.initDB();


//Prepare to rest
var app = express();
app.use(express.static(__dirname + '/public'));


// Redirect to the index page
app.get('/', function(req, res) {
    //res.send('Index')
    res.redirect('/pdf-rulefind.html');
});

// Start a search
app.get('/search', function(req, res) {

    wait.launchFiber(searchHelper, req, res);

    res.send('Search');
});

function searchHelper(req, res) {
    var books = req.query.books;
    var keywords = req.query.keywords;
    console.log("books list: " + books);
    console.log("keywords list: " + keywords);
    
    var bookSubset = fs.getAllowedSubset(userID, config, books);

    for (var book in bookSubset) {
	var currentBook = bookSubset[book];
        var bookText = fs.getBookText(currentBook);
    }

}

// Get the list of allowed books to search
app.get('/books', function(req, res) {
    //var jsonContents = JSON.stringify(fs.getAllAllowedBooks(userID, config));
    var jsonContents = fs.getAllAllowedBooks(userID, config);
    console.log("returning book list:");
    console.log(jsonContents);
    res.send(jsonContents);
});


console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
