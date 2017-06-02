//Import dependencies
var fs = require('fs');
var async = require('async');
var auth = require('./auth.js');
var extract = require('pdf-text-extract');
var mongo = require('mongodb').MongoClient;

//file paths
var configFile = '/etc/dmtk/pdf-rulefind-config.json';
var ruleBookDirDefault = "/usr/share/dmtk/rulebooks";
var ruleBookDir = ruleBookDirDefault;

////treat the user as a game master. 

//for now, uid 0 means you can see/use all books.
var dmsUserID = 0;

parseConfig();

//Read in and parse config file
function parseConfig() {
    return JSON.parse(fs.readFileSync(configFile, 'utf8'));
}


// Configures the rulebook directory in memory
function configureRuleBookDir(config) {
    ruleBookDirConfigured = config.ruleDirectory;
    if (ruleBookDirConfigured != null && ruleBookDirConfigured != "") {
        console.log("Rulebook directory configured to be: " + ruleBookDirConfigured);
        ruleBookDir = ruleBookDirConfigured;
    }
    //populateDB(config);
}

function populateDB(config) {

    var db = mongo.connect('mongodb://127.0.0.1:27017/dmtk', function(err, db) {
        if(err)
            throw err;
        console.log("connected to the mongoDB !");
        var bookCollection = db.collection('books');
	bookCollection.drop();

        var allowedBooks = JSON.parse(getAllAllowedBooks(dmsUserID, config));
        var length = allowedBooks.length;
        console.log("Processing " + length + " books.");
        if (mongo == null) {
            console.log("no db detected");
            exit(1);
        }

    	for (var bookno in allowedBooks) {
            populateBook(config, allowedBooks[bookno], parseInt(bookno) + 1, length, bookCollection);
        }
    });
}

function populateBook(config, bookName, bookNo, bookSetSize, dbCollection) {
    extract(ruleBookDir + '/' + bookName, function(err, pages){
        if (err) {
            console.log("bad book: " + bookName);
        }
	console.log("Finished extracting book " + bookNo + " of " + bookSetSize + ": " + bookName);

	var insertion = {name: bookName, pageData: pages};
	dbCollection.insert(insertion, {w: 1}, function(err) {
            if(err) {
                console.log("Database error!");
                throw err;
            }
            console.log('entry updated')
        });
    });	


}

// Returns the set of books that the user is allowed to view
function getAllAllowedBooks(userID, config) {
    //get the directory contents
    var dirContents = fs.readdirSync(ruleBookDir);
    console.log("Found " + dirContents.length + " books in the rule directory.");
    //console.log(dirContents);

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

function getAllowedSubset(userID, config,  bookSet) {
    //stub 
    return bookSet;
}

/*
function getBookText(bookName) {
    var db = mongo.connect('mongodb://127.0.0.1:27017/dmtk', function(err, db) {
        if(err)
            throw err;
        console.log("connected to the mongoDB !");
	var query = {"name": bookName};
        var bookData = db.collection('books').find(query);

	bookData.each(function(err, doc) {
            if (doc != null) {
                console.dir(doc);
            } else {
                return null;
	    }
	});

        db.close();
    });
    return "stub";
} 
*/

//Then, use a passed search method in the callback
function getBookTexts(bookArray, searchBookFunction, searchResultsFunction, callbackParams) {
    var db = mongo.connect('mongodb://127.0.0.1:27017/dmtk', function(err, db) {
        console.log("connected to the mongoDB !");
        if(err)
            throw err;

        var orArray = [];
        for (bookno in bookArray) {
            var bookName = bookArray[bookno];
            orArray[bookno] = {"name": bookName}; 
	}	
        var query = {$or: orArray};

        var bookData = db.collection('books').find(query);


	bookData.each(function(err, doc) {
            if (doc != null) {
                //console.dir(doc);
		//TODO
		//for each book in the set, search in it,
		//then search for the best match from your results
		console.log(doc['name']);
            } else {
                return null;
	    }
	});
        db.close();
    });

}


module.exports = exports;
module.exports.parseConfig = parseConfig;
module.exports.populateDB = populateDB;
module.exports.configureRuleBookDir = configureRuleBookDir;
module.exports.getAllAllowedBooks = getAllAllowedBooks;
module.exports.getBookTexts = getBookTexts; 
module.exports.getAllowedSubset = getAllowedSubset; 

