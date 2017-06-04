//Count how many keywords are found on a given page
function searchPage(pageText, keywords) {
    var pageWords = pageText.split();
    var score = 0;
    for (var index in pageWords) {
        var currentWord = pageWords[index];
        for (var keywordIndex in keywords) {
            var pattern = new RegExp(keywords[keywordIndex], "i")
            if (pattern.test(currentWord)) {
                score++;
            }
	}
    }
    return score;
}

//Find the page in a given book with the most keyword matches
function searchBook(pageArray, keywords) {
    var results = [];
    var bestPageSum = 0;
    var bestPageNo = 0;
    for (pageno in pageArray) {
        var pageSum = searchPage(pageArray[pageno], keywords);
        if (pageSum > bestPageSum) {
            bestPageSum = pageSum;
            bestPageNo = parseInt(pageno) + 1;
            results = [{"score": bestPageSum, "pageNo": bestPageNo}];
        } else if (pageSum == bestPageSum) {
            bestPageNo = parseInt(pageno) + 1;
	    results.push({"score": bestPageSum, "pageNo": bestPageNo})
        }
    }
    return JSON.stringify(results);
}

//Sort and a set of results, then send the trimmed set as a rest response.
function searchResults(resultSets, res) {
    var resultIndexArray = [];
    
    //Populate an array that
    //we can use for quicksort.
    for (var book in resultSets) {
	var results = JSON.parse(resultSets[book]);
        for (var pageResultNo in results) {
            var pageResult = results[pageResultNo];
	    resultIndexArray.push({book: book, result: pageResult});
        }
    }

    res.send(JSON.stringify(sortValues(resultIndexArray)));
}

//Sort the array
function sortValues(arrayToSort) {
    var tmpAry = [];
    for (var elem in arrayToSort) {
        tmpAry.push([arrayToSort[elem]["result"]["score"], arrayToSort[elem]]);
    }
    tmpAry = tmpAry.sort(function(a, b) {return b[0] - a[0]});
    var tmp2Ary = [];
    for (elem in tmpAry) {
        tmp2Ary[elem] = tmpAry[elem][1];
    }
    return tmp2Ary;
}

module.exports = exports;
module.exports.searchPage = searchPage;
module.exports.searchBook = searchBook;
module.exports.searchResults = searchResults;
