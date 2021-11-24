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

const clr={
  reset:         '\u001b[0m',
  black:         '\u001b[30m',
  red:           '\u001b[31m',
  green:         '\u001b[32m',
  yellow:        '\u001b[33m',
  blue:          '\u001b[34m',
  magenta:       '\u001b[35m',
  cyan:          '\u001b[36m',
  white:         '\u001b[37m',
  brightBlack:   '\u001b[30;1m',
  brightRed:     '\u001b[31;1m',
  brightGreen:   '\u001b[32;1m',
  brightYellow:  '\u001b[33;1m',
  brightBlue:    '\u001b[34;1m',
  brightMagenta: '\u001b[35;1m',
  brightCyan:    '\u001b[36;1m',
  brightWhite:   '\u001b[37;1m'
};


if(process.argv.length != 6){
  console.log(`${clr.blue}=============================================================================================${clr.reset}`);
  console.log(`${clr.brightMagenta}JSON INTERCOLLATOR${clr.reset} ${clr.magenta}(c) 2021 by Ed Trager <ed.trager@gmail.com>${clr.reset}`);
  console.log(`${clr.red}USAGE is:${clr.reset} node ./json_intercollator.js <key> <primary_json_file> <key2> <file_to_intercollate>`);
  console.log('');
  console.log(`For example, to add a set of Spanish (key: "es") translations to a master json file that`);
  console.log(`already has English definitions (key: "en"), your command line might look like the following:`);
  console.log('');
  console.log(`${clr.green}node ./json_intercollator.js en master.json es es_translations.txt > intercollated_result.json${clr.reset}`);
  console.log('');
  console.log('NOTA BENE: For this to work properly, the number of "en" key-value pairs in the original file');
  console.log('           must match the number of "es" key-value pairs in the file that you want to inter-');
  console.log('           collate and of course the "en" and "es" definitions need to line up.');
  console.log(`${clr.blue}=============================================================================================${clr.reset}`);
  process.exit(1);
}

/////////////////////////////////
//
// START OF MAIN
//
//////////////////////////////////
const mainKey  = process.argv[2];
const mainFile = process.argv[3];
const intrKey  = process.argv[4];
const intercollateFile = process.argv[5];

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
  const mainKeyRegex = new RegExp(`"${mainKey}":`);
  for(let i=0,j=0;i<main.length;i++){
    if(main[i].match( mainKeyRegex )){
      // This is where we are going to intercollate a line into the existing json:
      // If the main line already ends in a comma, that's fine; if it doesn't, then add a comma:
      const endingForMain = main[i].match(/,$/) ? '' : ',' ;
      console.log(`${main[i]}${endingForMain}`);
      // Now insert the line from the second file that we want to intercollate:
      // In this case, if the original line had a comma, we keep that comma here.
      // If it did not have a comma, then we don't want a comma here either, because
      // our new intercollated line will now be the final line in the sub-object:
      const endingForIntercollated = main[i].match(/,$/) ? ',' : '' ;
      console.log(`  "${intrKey}":${intr[j]}${endingForIntercollated}`);
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
  
  console.error('=> FILE 1 HAS BEEN LOADED ...');
  // SET UP READER FOR SECOND FILE:
  var intrReader = require('readline').createInterface({
    input: require('fs').createReadStream(intercollateFile)
  });
  
  intrReader.on('line',function(line){
    intr.push(line);
  });
  
  intrReader.on('close',function(){
    console.error('=> FILE 2 HAS BEEN LOADED ...');
    console.error('=> STARTING INTERCOLLATION ...');
    intercollate(main,intr);
    console.error('=> FINISHED!');
  });
  
});
