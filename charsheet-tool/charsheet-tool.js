//Import dependencies
var serveStatic = require('serve-static');
var express = require('express');
var sqlDB = require('mariasql');
var fs = require('fs');

var dbConfig = null;
var milliseconds_valid = 1800000;

function cliHandler() {

}

//Prepare the rest api
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('/charsheet-tool.html');
});

app.get('/get-auth-times', function(req, res) {
    var date = new Date();
    var startTime = date.getTime();
    var endTime = startTime - milliseconds_valid;
    //res.send("tmp");
    res.send(JSON.stringify({
        'validFrom': '' + startTime,
        'validThrough': '' + endTime
    }));
});

app.listen(8080, function() {
    console.log('listening on port 8080');
});
