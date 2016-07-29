#!/usr/bin/env node
//
// jsonify.js (c) 2016 by Edward H. Trager ALL RIGHTS RESERVED
//
// released under GNU GPL 2.0 or later at your discretion
//
// Takes tabular data and converts it to JSON to create a
// JSON flashcard deck for use in my flashcard app.
//
// The tabular data are assumed to consist of the following
// six columns delimited by tabs:
//
// cat en es cla mod nah
//
// where:
//
// cat: Category (animals, health, food, basic phrases, etc.)
// en : Translation of the Nahuatl word or phrase in English
// es : Translation of the Nahuatl word or phrase in Spanish
// cla: Nahuatl word or phrase in the traditional "classical" orthography
// mod: Nahuatl word or phrase in the modern "SEP" orthography
// nah: Nahuatl word in the new Nahuatl abugida that I developed
//

///////////////////////////
//
// arguments:
//
///////////////////////////
var path = process.argv[2];

///////////////////////////
//
// require filesystem:
//
///////////////////////////
var fs   = require("fs");

////////////////////////////
//
// global vars:
//
////////////////////////////
var category="";
var outputFile="";

if(process.argv.length!=3){
	console.log("Usage: " + process.argv[1] + " <data_file_to_process>");
	return 1;
}

/////////////////
//
// readDataFile
//
/////////////////
function readDataFile(err,data){
	var array = data.toString().split('\n');
	//var array = data.split('\n');
	console.log("The file has " + array.length + " lines:");
	for(i=0;i<array.length;i++){
		var noTerminalComma
		// Check if this is the last line for this category:
		var thisCat = array[i].split('\t')[0];
		var nextCat;
		if(i<array.length-1){
			nextCat = array[i+1].split('\t')[0];
		}else{
			nextCat = "";
		}
		var noTerminalComma= (thisCat!=nextCat);
		processLine(array[i],noTerminalComma);
	}
	
}

///////////////////////
//
// processLine
//
///////////////////////

function processLine(line,noTerminalComma){
	var varz = line.split('\t');
	var cat  = varz[0];
	var en   = varz[1];
	var es   = varz[2];
	var cla  = varz[3];
	var mod  = varz[4];
	var nah  = varz[5];
	
	var au   = "audio/" + cla + ".mp3";
	// Change any sequence of spaces in the "cla" phrase to underscores for the filenames:
	au = au.replace(/ +/g,"_");
	
	if(cat!=category){
		category=cat;
		///////////////////////////////
		//
		// Write file header:
		//
		///////////////////////////////
		outputFile = cat + ".data";
		console.log(">>> Writing data to " + outputFile );
		
		fs.appendFileSync(outputFile,"{\n");
		// OK there should be but currently there is no difference between title_en and title_es:
		// One can hand-edit the result file if or when this is important:
		fs.appendFileSync(outputFile,"\"title_en\":\""+category+"\",\n");
		fs.appendFileSync(outputFile,"\"title_es\":\""+category+"\",\n");
		fs.appendFileSync(outputFile,"\"author\":\"Edward H. Trager\",\n");
		fs.appendFileSync(outputFile,"\"copyright\":\"Copyright 2016 by Edward H. Trager\",\n");
		fs.appendFileSync(outputFile,"\"license\":\"Released under the Creative Commons Share Alike license SA-3.0\",\n");
		fs.appendFileSync(outputFile,"\"info\":\"Compiled by Edward H. Trager, July 2016\",\n");
		fs.appendFileSync(outputFile,"\"script\":\"nahuatl\",\n");
		fs.appendFileSync(outputFile,"\"suggestedFont\":\"NahuatlOne\",\n");
		fs.appendFileSync(outputFile,"\"suggestedFontFileName\":\"NahuatlOne.otf\",\n");
		fs.appendFileSync(outputFile,"\"cards\":[\n");
		
	}
	var jsonLine = "  {\"nah\":\""+nah+"\",\"cla\":\""+cla+"\",\"mod\":\""+mod+"\",\"es\":\""+es+"\",\"en\":\""+en+"\",\"au\":\""+au+"\"}";
	if(outputFile){
		fs.appendFileSync(outputFile,jsonLine);
		if(noTerminalComma){
			fs.appendFileSync(outputFile,"\n ]\n}\n");
		}else{
			fs.appendFileSync(outputFile,",\n");
		}
	}
}

/////////////////////
//
// MAIN
//
/////////////////////
fs.readFile(path,"utf-8",readDataFile);
return 0;

