//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var fs = require('fs');
var ruleBookDir = "/usr/share/dmtk/rulebooks";
var configFile = '/etc/dmtk/pdf-rulefind-config.json';

//Read in and parse config file
var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

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

app.get('/books', function(req, res) {
    fs.exists(ruleBookDir,function(exists){
        //res.send("Exists");
        var dirContents = fs.readdirSync(ruleBookDir);
        console.log("Rulebook directory contents:");
        console.log(dirContents);
        var jsonContents = JSON.stringify(dirContents);
        res.send(jsonContents);
        // handle result
    });
});

console.log('Started');
console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
