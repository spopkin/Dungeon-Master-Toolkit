//console.log("num argv " + process.argv.length);
var num_argv = process.argv.length;
//If there aren't enough arguments to constitute a set of dice
if (num_argv < 4) {
    console.log("Usage: " + process.argv[0] + " " + process.argv[1] +
        " <num dice> <die size>");
}
else {
    var total = 0;
    console.log("Your dice: " + process.argv[2] + "d" + process.argv[3]);
    for (i = 0; i < process.argv[2]; i++) {
	var die_roll = Math.floor(Math.random() * process.argv[3] + 1)
        console.log("die roll: " + die_roll);
	total += die_roll;
    }
    console.log("total: " + total);
}
