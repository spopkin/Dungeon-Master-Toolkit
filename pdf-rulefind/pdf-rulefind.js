//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var fs = require('./fswrapper.js');
var search = require('./search-functions.js');
var wait = require('wait.for');

//current user's id
var userID = 0;

var config = null;

// Process command line flags here (none yet)
function cliHandler() {
    var initDB = false;
    process.argv.forEach(function(val, index) {
        if (val === '--help') {
            console.log("usage: " + process.argv[0] + " " + process.argv[1] + " [--refresh-db] [--help]");
            console.log("Then open your browser to localhost:8080/pdf-rulefind.html");
            process.exit();
        } else if (val === '--refresh-db') {
            console.log("Refreshing database.");
            initDB = true;
        }
    });

    config = fs.parseConfig();
    console.log(config);
    fs.configureRuleBookDir(config);

    if (initDB) {
        fs.populateDB(config);
    }
}


//Run setup tasks
cliHandler();


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
});

function searchHelper(req, res) {
    var books = req.query.books;
    var keywords = req.query.keywords;
    console.log("books list: " + books);
    console.log("keywords list: " + keywords);

    var bookSubset = fs.getAllowedSubset(userID, config, books);
    fs.getBookTexts(bookSubset, search.searchBook, search.searchResults, keywords, res);
}


// Get the list of allowed books to search
app.get('/books', function(req, res) {
    var jsonContents = fs.getAllAllowedBooks(userID, config);
    console.log("returning book list:");
    console.log(jsonContents);
    res.send(jsonContents);
});


console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function() {
    console.log('listening on port 8080')
})
