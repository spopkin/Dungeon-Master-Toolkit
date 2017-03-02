//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var fs = require('fs');
var configFile = '/etc/dmtk/pdf-rulefind-config.json';
var ruleBookDirDefault = "/usr/share/dmtk/rulebooks";
var ruleBookDir = ruleBookDirDefault;

//Read in and parse config file
var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
ruleBookDirConfigured = config.ruleDirectory;
if (ruleBookDirConfigured != null && ruleBookDirConfigured != "") {
    console.log("Rulebook directory configured to be: " + ruleBookDirConfigured);
    ruleBookDir = ruleBookDirConfigured;
}

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
        //get the directory contents
        var dirContents = fs.readdirSync(ruleBookDir);
        console.log("Rulebook directory contents:");
        console.log(dirContents);
        var jsonContents = JSON.stringify(dirContents);
        res.send(jsonContents);

        //is book whitelisting enabled
        if (config.bookWhitelist) {
            console.log("allowed books are whitelisted");
            console.log("whitelist: " + config.whiteList);
        } 
        //is book blacklisting enabled
        if (config.bookBlackList) {
            console.log("disallowed books are blacklisted");
            console.log("blackList: " + config.blackList);
        }
        //are dungeon masters immune to black and white listing of books?
        if (config.dmsOverrideBlackWhiteLists) {
            console.log("game masters can see all books");
        }
    });
});

console.log('Started');
console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
