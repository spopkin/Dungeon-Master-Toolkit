//Attempt to find a specific rule in a pdf file
//Do note that you will have to handle input validation externally.

var connect=require('connect');
var serveStatic=require('serve-static');

var filename;
var keywords;
function handleParams() {
    if(process.argv.length < 4) {
        console.log("Usage: " + process.argv[0] + " " + process.argv[1] + " "
            + "<filename> <keyword to search for> [more keywords]...");
    }
    filename = process.argv[2];
    keywords = [];
    for (i=3; i < process.argv.length; i++) {
        keywords.push(process.argv[i]);
    }
    console.log("search " + filename + " for " + keywords);
}
handleParams();

connect().use(serveStatic(__dirname)).listen(8080, function() {
    console.log("Running on 8080...")
});
