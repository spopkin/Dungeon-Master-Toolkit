//Import dependencies
var fs = require('fs');

//Read in and parse config file
var config = JSON.parse(fs.readFileSync('/etc/dmtk/pdf-rulefind-config.json', 'utf8'));


console.log("Started");
console.log("Using " + config.ruleDirectory + " as rulebook directory.");

