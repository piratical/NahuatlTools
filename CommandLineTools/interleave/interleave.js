//////////////////////////////////////
//
// interleave.js
//
// (c) 2021 by Ed Trager
//
// This script reads 2 or more text
// files and interleaves the paragraphs
// of each, assigning a CSS class to
// each paragraph to distinguish which
// file it came from. The CSS classes
// are also passed on the command line,
// each preceding a file name. A colon
// ":" is used as a delimiter between
// the class name and file name.
//
// The use case is to interleave
// a source text with translations
// into one or more other languages.
// 
//////////////////////////////////////

//
// STT MAIN
//
const fs = require('fs');
const readline = require('readline');


if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + 'className:fileName');
  console.log('  ... where className will become the CSS class of the paragraphs in fileName');
  console.log('  and fileName is a text file with paragraphs separated by blank lines.');
  process.exit(1);
}

const fileMap = [];

for(let i=2;i< process.argv.length;i++){
  let entry = {};
  [ entry.className , entry.fileName ] = process.argv[i].split(':');
  fileMap.push( entry );
}

/////////////////////////////////
//
// Keep track of file count and
// processedCount:
//
/////////////////////////////////
const fileCount = fileMap.length;
let processedCount = 0;

// Read first file:
//readFile(fileMap[0]);

//////////////////////////////////////////////////////
//
// Read all the files (asynchronously, by the way):
//
//////////////////////////////////////////////////////
fileMap.forEach( entry => {
  // we pass finalStep as a callback:
  readFile(entry, ()=>{
    finalStep(fileMap);
  });
});

//
// END MAIN
//

//
// FUNCTIONS:
//

//////////////////////////////////
//
// finalStep
//
//////////////////////////////////
function finalStep(fileMap){
  
  const fileCount = fileMap.length;
  
  const paragraphCount = fileMap[0].paragraphs.length;
  
  for(let p=0;p<paragraphCount;p++){
   for(let f=0;f<fileCount;f++){
     writeOneParagraph(fileMap[f].className,fileMap[f].paragraphs[p],(f===0));
   }
  }

}

//////////////////////////////////
//
// readFile
//
//////////////////////////////////
async function readFile(fileMapEntry,finalStepCallback) {
  const fileStream = fs.createReadStream(fileMapEntry.fileName);

  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // \r\n will be recognized as single line break
  });

  const paragraphs = [];
  let paragraph = ''
  
  lineReader.on('line', line => {
    if(line){
      if(paragraph){
        paragraph += '\n';
      }
      paragraph += line;
    }else{
      //blank line encountered:
      if(paragraph){
        paragraphs.push(paragraph);
        paragraph='';
      }
    }
  });
  
  lineReader.on('close', d=>{
    if(paragraph){
      paragraphs.push(paragraph);
      paragraph='';
    }

    // Attach the paragraphs to the
    // fileMapEntry:
    fileMapEntry.paragraphs = paragraphs;

    // Increment the global processedCount counter:
    // to see if we should call the "finalStep" callback:
    if(++processedCount === fileCount ){
      finalStepCallback();
    }
  });
  
}

//////////////////////////////////
//
// writeParagraphs
//
//////////////////////////////////
function writeParagraphs(fileMapEntry){

  fileMapEntry.paragraphs.forEach( paragraph =>{
    
    console.log('\n');
    console.log(`<p class='${fileMapEntry.className}'>`);
    console.log(paragraph);
    console.log(`</p>`);
    
  });

}

//////////////////////////
//
// writeOneParagraph
//
///////////////////////////
function writeOneParagraph(className,paragraph,show){
  
  let showHide = show ? 'show':'hide';
  console.log('\n');
  console.log(`<p class='${className} ${showHide}'>`);
  console.log(paragraph);
  console.log('</p>');
 
}

return 0;



