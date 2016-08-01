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

var result = {items:[]};

function Comparator(a, b){
	if(a.result.length > b.result.length){
		return -1;
	}else if (a.result.length < b.result.length) {
		return 1;
	}else{
		if(JSON.stringify(a.result) === JSON.stringify(b.result)){
			return 0;
		}else if(JSON.stringify(a.result) > JSON.stringify(b.result)){
			return -1;
		}else{
			return 1;
		}		
	}	
}
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
	writeResults();
}
/**
Function to write results in different formats.
*/
function writeResults(){	
	result.items.sort(Comparator);
	var writeStreamGrouped = fs.createWriteStream('./resultGrouped.txt');
	var writeStreamHtml = fs.createWriteStream('./resultGrouped.html');
	writeStreamHtml.write("<html>");
	writeStreamHtml.write("<head><style>table, th, td {border: 1px solid black; border-collapse: collapse; padding: 5px; text-align: left;}</style></head><body>");
	writeStreamHtml.write("<table width='100%'>");
	writeStreamHtml.write("<thead><tr><th>Pattern</th><th>Matching Sequence</th></tr></thead>");
	writeStreamHtml.write("<tbody>");
	for(var newKey in result.items){
		var itemPrevious;
		var itemNew = result.items[newKey];
		if(itemPrevious === undefined){
			itemPrevious = result.items[newKey];
		}
		if(JSON.stringify(itemPrevious.result) !== JSON.stringify(itemNew.result)){
			writeStreamGrouped.write("\nnew Group Start\n");
			itemPrevious = itemNew;
			writeStreamHtml.write("<tr><td colspan='2' style='background-color:yellow'>&nbsp;</td></tr>");
		}		
		writeStreamGrouped.write(JSON.stringify(itemNew)+"\n");
		var newItemArr = [];
		for(var itemKey in itemNew.result){
			var item = itemNew.result[itemKey];
			var re = new RegExp(itemNew.key, 'g');
			item = item.replace(re, "<span style='color:red'>"+itemNew.key+"</span>");
			newItemArr.push(item);
		}
		writeStreamHtml.write("<tr><td>"+JSON.stringify(itemNew.key)+"</td><td>"+JSON.stringify(newItemArr)+"</td></tr>");
	}
	writeStreamHtml.write("</tbody>");
	writeStreamHtml.write("</table>");
	writeStreamHtml.write("</body></html>");
	writeStreamHtml.end();
	writeStreamGrouped.end();
	var writeStreamJSON = fs.createWriteStream('./result.json');
	writeStreamJSON.write(JSON.stringify(result));
	writeStreamJSON.end();	
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
			result.items.push({key: newVal,	result: retArray});
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