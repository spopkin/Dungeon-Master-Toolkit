function searchPage(pageText, keywords) {
    var results = {};
    var pageWords = pageText.split();
    var score = 0;
    var scoreList = {};
    for (var keywordIndex in keywords) {
        var keyword = keywords[keywordIndex];
	scoreList[keyword] = 0;
    }
    for (var index in pageWords) {
        var currentWord = pageWords[index];
        for (var keywordIndex in keywords) {
            var keyword = keywords[keywordIndex];
            var matches = currentWord.match(/keyword/i);
            for (var matchno in matches) {
                scoreList[keyword]++;
                score++;
            }
	}
    }
    results["overall"] = score;
    results["words"] = scoreList;
    console.log(JSON.stringify(results));
    return results;
}

function searchBook(pageArray, keywords) {
/*    var resultsArray = {};
    var bestPage = -1;
    var wordSums = {};
    for (var keywordIndex in keywords) {
        var keyword = keywords[keywordIndex];
        wordSums[keyword] = 0;
    }
    var totalSum = 0;
*/
    for (pageno in pageArray) {
        var pageResults = searchPage(pageArray[pageno], keywords);
//	totalSum = totalSum + pageResults["overall"];
    }
 //   searchPage(pageArray[0], keywords)
    return null;
}






module.exports = exports;
module.exports.searchPage = searchPage;
module.exports.searchBook = searchBook;
