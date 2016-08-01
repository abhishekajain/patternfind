var LineByLineReader = require('line-by-line');

const fs = require('fs');

readLinesLbL();

function findMatchingArray(arg1, myArray){
	var resultArr = [];	
	if(searchedPatternArr.indexOf(arg1) <= -1){
		var myObj;
		searchedPatternArr.push(arg1);
		for (myObj in myArray) {
			var arrayObject = myArray[myObj];
			if(arrayObject.indexOf(arg1) !== -1){
				resultArr.push(arrayObject);
			}
		}
	}
	return resultArr;	
}

//array variable to hold patterns that found mataching sequence.
var searchedPatternArr = [];
/**
Function that stat write stream of result.txt file.
Loop all the data collected from reading file.
Calls patternBreaker function that will further break each sequence.
*/
function findPattern(inputArray){
	var writeStream = fs.createWriteStream('./result.txt');
	var key;
	for(key in inputArray){
		var value = inputArray[key];
		var valueLan = value.length;
		var i;
		for (i = 0; i < valueLan; i++) {
			var newVal = value.substring(i, valueLan);
			patternBreaker(newVal, writeStream, inputArray);
		}		
	}
	writeStream.end();
}
/**
Function break sequence in reverse and calls findMatchingArray seqeuence of pattern.
Write results in the file.
*/
function patternBreaker(value, writeStream, inputArray){
	var valueLan = value.length;
	var i;
	for (i = valueLan; i > 2; i--) { 
		var newVal = value.substring(0, i);
		var retArray = findMatchingArray(newVal, inputArray);
		if(retArray.length>1){
			writeStream.write('results of pattern :'+newVal+':');
			writeStream.write('['+retArray+']\n');
		}
	}	
}

/**
This function read data file and create Collection of data.
Once data collection is complete it calls function that will start finding patterns in each element of collection.
*/
function readLinesLbL(){
	var lr = new LineByLineReader('data.txt');
	var resultArr = [];
	lr.on('line', function (line) {
		resultArr.push(line);
	});

	lr.on('end', function () {
		findPattern(resultArr);
	});	
}