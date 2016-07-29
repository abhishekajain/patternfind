var LineByLineReader = require('line-by-line');

const fs = require('fs');

readLinesLbL();

function findMatchingArray(arg1, myArray){
	//console.log(arg1);
	//console.log(myArray);
	var resultArr = [];	
	if(searchedPatternArr.indexOf(arg1) <= -1){
		//console.log(searchedPatternArr+':'+searchedPatternArr.indexOf(arg1)+':'+arg1);
		var myObj;
		searchedPatternArr.push(arg1);
		for (myObj in myArray) {
			var arrayObject = myArray[myObj];
			//console.log(arrayObject);
			if(arrayObject.indexOf(arg1) !== -1){
				resultArr.push(arrayObject);
			}
		}
	}
	return resultArr;	
}

function arrayfind(thisarg){
	//console.log(element+index+ array+ thisarg);
	var key;
	if(key in searchedPatternArr){
		if(searchedPatternArr[key] === thisarg) {
			return true;
		}
	}
	return false;
}
var searchedPatternArr = [];

function findPattern(inputArray){
	var writeStream = fs.createWriteStream('./result.txt');
	var key;
	for(key in inputArray){
		//console.log(key);
		var value = inputArray[key];
		var valueLan = value.length;
		//console.log(value);
		var i;
		for (i = 0; i < valueLan; i++) {
			var newVal = value.substring(i, valueLan);
			//console.log(newVal);
			patternBreaker(newVal, writeStream, inputArray);
		}		
	}
	writeStream.end();
}

function patternBreaker(value, writeStream, inputArray){
	var valueLan = value.length;
	var i;
	for (i = valueLan; i > 2; i--) { 
		var newVal = value.substring(0, i);
		var retArray = findMatchingArray(newVal, inputArray);
		//console.log(newVal);
		//console.log(retArray);
		if(retArray.length>1){
			writeStream.write('results of pattern :'+newVal+':');
			writeStream.write('['+retArray+']\n');
		}
	}	
}


function readLinesLbL(){
	var lr = new LineByLineReader('data.txt');
	var resultArr = [];
	lr.on('line', function (line) {
		resultArr.push(line);
	});

	lr.on('end', function () {
		//console.log(resultArr);
		findPattern(resultArr);
	});	
}