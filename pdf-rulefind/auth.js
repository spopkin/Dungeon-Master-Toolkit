//stub:  this user id means dungeon master
var dmUserID = 0;

function userIsDM(userID) {
    return userID == dmUserID;
}

module.exports.userIsDM = userIsDM;
