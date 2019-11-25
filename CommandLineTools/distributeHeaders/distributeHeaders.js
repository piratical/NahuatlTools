//
// distributeHeaders.js
// 
// (c) 2019 by Edward H. Trager
// All Rights Reserved
// Released under GPL 2.0 or Later
//
// Written: 2019.11.25
//
const readline = require('readline');
const fs = require('fs');

if(process.argv.length<3){
  console.log('Missing name of file to process');
  exit(2);
}

const fileToRead = process.argv[2];

const readInterface = readline.createInterface({
    input: fs.createReadStream(fileToRead),
    output: process.stdout,
    console: false
});

// lineReader:
let header='';
function lineReader(line){
  line = line.trim();
  //console.log(`|${line}| ${line.length}`);
  if(!line){
    // empty line:
    header='' // resetting the header
  }else if(!header && line){
    // header was reset but now we have a new line, so take that as the new header:
    header=line;
  }else{
    // print out the header then the line:
    console.log(`${header}\t${line}`);
  }
}

// Read the lines:
readInterface.on('line',lineReader);


