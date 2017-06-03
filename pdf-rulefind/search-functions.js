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
            //var regex = new RegExp(/);
	}
    }
//    console.log(score);
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
//    console.log(JSON.stringify(results)); 
    return JSON.stringify(results);
}

//Sort and prune a set of results, then send the trimmed set
//as a rest response.
function searchResults(resultSets, res) {
    var resultIndexArray = [];
    
    //Populate an array that
    //we can use for quicksort.
    for (var book in resultSets) {
//        console.log(book);
	var results = JSON.parse(resultSets[book]);
        for (var pageResultNo in results) {
            var pageResult = results[pageResultNo];
//	    console.log(pageResult);
	    resultIndexArray.push({book: book, result: pageResult});
        }
    }

    for (var index in resultIndexArray) {
      //  console.log(JSON.stringify(resultIndexArray[index]));
    }

    var sortedArray = quickSort(resultIndexArray, pivot(resultIndexArray));
    for (var itemNo in sortedArray) {
        console.log(JSON.stringify(sortedArray[itemNo]));
    } 
}


function quickSort(arrayToSort, pivot) {
    var breakIndex = 0;
    var sortedArray = []; 

    if (arrayToSort.length <= 1) {
        return arrayToSort;
    }

    var noop = true;
    for (var i = 0; i < arrayToSort.length; i++) {
        var swapped = false;
	var leftElem = arrayToSort[i]; 
        var leftVal = parseInt(leftElem["result"]["score"]);
        if (leftVal >= pivot) {
            for (var j = arrayToSort.length - 1; j > i; j--) {
                var rightElem = arrayToSort[j]; 
                var rightVal = parseInt(rightElem["result"]["score"]);
		if (rightVal < pivot) {
                    //transpose right and left
                    arrayToSort[i] = rightElem;
		    arrayToSort[j] = leftElem;
		    swapped = true;
		    noop = false;
		    console.log("swapped");
		    break; //advance the left pointer
                }
            }
            if (!swapped) {
                console.log("Partitioning complete, split and recur.");

                //make sure that we're sorted and not just choosing a bad pivot
                if (noop && checkSort(arrayToSort)) {
                    return arrayToSort; 
                }
               
                break;
//                break;
            }
//            console.log("" + leftElem["book"] + " (" + leftElem["result"]["pageNo"] + "): " + leftVal);
	}
    }

//    console.log(pivot);
    return sortedArray;
}

//Compute a pivot.
function pivot(arrayToSort) {
    return parseInt(arrayToSort[0]["result"]["score"]);
}

//Check if an array is sorted
function checkSort(sortedArray) {
    var prev = 0;
    for (var index = 0; index < sortedArray.length; index++) {
        var val = parseInt(sortedArray[index]["result"]["score"]);
        if (val < prev) {
            return false;
        }
    }
    return true;
}

module.exports = exports;
module.exports.searchPage = searchPage;
module.exports.searchBook = searchBook;
module.exports.searchResults = searchResults;
