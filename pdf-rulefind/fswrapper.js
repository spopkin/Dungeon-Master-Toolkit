//Import dependencies
var fs = require('fs');
var auth = require('./auth.js');
//var pdflib = require('pdf-text-extract');

//file paths
var configFile = '/etc/dmtk/pdf-rulefind-config.json';
var ruleBookDirDefault = "/usr/share/dmtk/rulebooks";
var ruleBookDir = ruleBookDirDefault;

////treat the user as a game master. 
//var userIsDM = 0;

//for now, uid 0 means you can see/use all books.
var dmsUserID = 0;

parseConfig();

//Read in and parse config file
function parseConfig() {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
}

function configureRuleBookDir(config) {
    ruleBookDirConfigured = config.ruleDirectory;
    if (ruleBookDirConfigured != null && ruleBookDirConfigured != "") {
        console.log("Rulebook directory configured to be: " + ruleBookDirConfigured);
        ruleBookDir = ruleBookDirConfigured;
    }
}

function getAllAllowedBooks(userID, config) {
    //fs.exists(ruleBookDir,function(exists){
    //get the directory contents
    var dirContents = fs.readdirSync(ruleBookDir);
    console.log("Rulebook directory contents:");
    console.log(dirContents);

    var whiteListedBookArray = [];

    //are dungeon masters immune to black and white listing of books?
    if (config.dmsOverrideBlackWhiteLists) {
        console.log("game masters can see all books");
    } else {
        console.log("DMs are mortal");
    }
    var override = config.dmsOverrideBlackWhiteLists && auth.userIsDM(userID);
    //is book whitelisting enabled
    if (config.bookWhitelist && !override) {
        console.log("allowed books are whitelisted");
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
    var json = JSON.stringify(whiteListedBookArray);
    return json   
}

function getBookData(bookName, config) {

}



module.exports = exports;
module.exports.parseConfig = parseConfig;
module.exports.configureRuleBookDir = configureRuleBookDir;
module.exports.getAllAllowedBooks = getAllAllowedBooks;
module.exports.getBookData = getBookData; 

