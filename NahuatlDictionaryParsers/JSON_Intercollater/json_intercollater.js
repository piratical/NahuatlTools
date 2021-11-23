///////////////////////////////////////////////////
//
// json_intercollator.js
//
// (c) 2021 by Edward H. Trager
// <ed.trager@gmail.com> All Rights Reserved
//
///////////////////////////////////////////////////

const fs       = require('fs');
const readline = require('readline');

if(process.argv.length != 4){
  console.log('Please specify both the primary file and the file to intercollate.');
  process.exit(1);
}

/////////////////////////////////
//
// START OF MAIN
//
//////////////////////////////////
const mainFile = process.argv[2];
const intercollateFile = process.argv[3];

// READER FOR FIRST FILE:
var mainReader = require('readline').createInterface({
  input: require('fs').createReadStream(mainFile)
});


//////////////////////////////////////
//
// GLOBAL ARRAYS AND COUNTERS:
//
//////////////////////////////////////
const main = [];
const intr = [];


function intercollate(main,intr){
  for(let i=0,j=0;i<main.length;i++){
    if(main[i].match(/"def":/)){
      // This is where we are going to intercollate a line into the existing json:
      // If the main line already ends in a comma, that's fine; if it doesn't, then add a comma:
      const endingForMain = main[i].match(/,$/) ? '' : ',' ;
      console.log(`${main[i]}${endingForMain}`);
      // Now insert the line from the second file that we want to intercollate:
      // In this case, if the original line had a comma, we keep that comma here.
      // If it did not have a comma, then we don't want a comma here either, because
      // our new intercollated line will now be the final line in the sub-object:
      const endingForIntercollated = main[i].match(/,$/) ? ',' : '' ;
      console.log(`  "en":${intr[j]}${endingForIntercollated}`);
      j++;
    }else{
      // Just print the line as it originally was:
      console.log(main[i]);
    }
  }
}

/////////////////////////////////////
//
// mainReader ON LINE PROCESSOR:
//
/////////////////////////////////////
mainReader.on('line', function (line) {
  main.push(line);
});

mainReader.on('close',function(){
  
  console.error('=> FILE 1 HAS BEEN LOADED');
  // SET UP READER FOR SECOND FILE:
  var intrReader = require('readline').createInterface({
    input: require('fs').createReadStream(intercollateFile)
  });
  
  intrReader.on('line',function(line){
    intr.push(line);
  });
  
  intrReader.on('close',function(){
    console.error('=> FILE 2 HAS BEEN LOADED');
    console.error('=> STARTING INTERCOLLATION ...');
    intercollate(main,intr);
  });
  
});
