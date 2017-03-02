//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var fs = require('fs');
var configFile = '/etc/dmtk/pdf-rulefind-config.json';
var ruleBookDirDefault = "/usr/share/dmtk/rulebooks";
var ruleBookDir = ruleBookDirDefault;

//treat the user as a game master. 
var userIsDM = 0;

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
//        var jsonContents = JSON.stringify(dirContents);
//        res.send(jsonContents);

        var whiteListedBookArray = [];

        //are dungeon masters immune to black and white listing of books?
        if (config.dmsOverrideBlackWhiteLists) {
            console.log("game masters can see all books");
        } else {
            console.log("DMs are mortal");
        }
        var override = config.dmsOverrideBlackWhiteLists && userIsDM;
        //is book whitelisting enabled
        if (config.bookWhitelist && !override) {
            console.log("allowed books are whitelisted");
//            console.log("whitelist: " + config.whiteList);
            var whitelist = config.whiteList;
            for (var index in dirContents) {
                if (whitelist.indexOf(dirContents[index]) > -1) {
                    whiteListedBookArray.push(dirContents[index]);
                } 
            }
        } else {
            console.log("whitelisting disabled");
            for (var index in dirContents) {
                whiteListedBookArray.push(dirContents[index]);
            }
        }
        //is book blacklisting enabled
        if (config.bookBlackList && !override) {
            console.log("disallowed books are blacklisted");
//            console.log("blackList: " + config.blackList);
            var blackList = config.blackList;
            for (var index in blackList) {
                var bookExistsIndex = whiteListedBookArray.indexOf(config.blackList[index]);
                if (bookExistsIndex > -1) {
                    whiteListedBookArray.splice(bookExistsIndex, 1);
                }
            }
        } else {
            console.log("blacklisting disabled");
        }
        var jsonContents = JSON.stringify(whiteListedBookArray);
        res.send(jsonContents);
    });
});

console.log('Started');
console.log('Using ' + config.ruleDirectory + ' as rulebook directory.');

app.listen(8080, function () {
      console.log('listening on port 8080')
})
