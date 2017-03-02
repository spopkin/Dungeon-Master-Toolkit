//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var fs = require('fs');

//Read in and parse config file
var config = JSON.parse(fs.readFileSync('/etc/dmtk/pdf-rulefind-config.json', 'utf8'));

//Prepare to rest
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    //res.send('Index')
    res.redirect('/pdf-rulefind.html');
});

app.get('/search', function(req, res) {
    console.log("books list: " + req.query.books);
    console.log("keyword list: " + req.query.keywords);
    res.send('Search');
});

console.log('Started');
console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
