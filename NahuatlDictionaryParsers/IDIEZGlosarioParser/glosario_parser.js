//////////////////////////////////////////////////////////////////////////////////////
//
// idiez_parser
//
// This parser is designed to parse the IDIEZ monolingual Nahuatl dictionary,
// Tlahtolxitlauhcayotl by John Sullivan, Eduardo de la Cruz Cruz, 
// Abelardo de la Cruz de la Cruz, Delfina de la Cruz de la Cruz, 
// Victoriano de la Cruz Cruz, Sabina Cruz de la Cruz, Ofelia Cruz Morales,
// Catalina Cruz de la Cruz, and Manuel de la Cruz Cruz
//
// The PDF can be found online at:
// http://www.revitalization.al.uw.edu.pl/Content/Uploaded/Documents/06072016-578bcfcf-5d70-4db1-a2ac-7c7509d30072.pdf
//
// This parser (c) 2021 by Edward H. Trager. ALL RIGHTS RESERVED
//
//////////////////////////////////////////////////////////////////////////////////////
const fs       = require('fs');
const readline = require('readline');

const makeEntriesLowerCase = true;

if(process.argv.length != 3){
  console.log('Please specify file to read.');
  process.exit(1);
}

// REGEXP PATTERNS FOR DISCARDABLE STUFF:
// This includes blank lines as well as the page headwords and page number:
const discardable = new RegExp('^\u000c* *$|^\u000c*[A-ZĀĒĪŌŪ]+[1-9]?$|^\u000c*[0-9]{1,3}$');

// Parts of speech abbreviations list from the PDF:
// These are listed from longest to shortest to insure proper
// matching behavior:
const abbr=[
  'achi',
  'huahca',
  'miaq',
  'panoc',
  'panotoc',
  'pil',
  'piltlah',
  'tlaaxca',
  'tlach',
  'tlach. axahci',
  'tlach1',
  'tlach2',
  'tlach3',
  'tlach4',
  'tlachihual',
  'tlachiuhca',
  'tlaeli',
  'tlalocotz',
  'tlamotz',
  'tlaomp',
  'tlap',
  'tlapihui',
  'tlat',
  'tlatec',
  'tlaten',
  'tlazal',
  'tzinpehua',
  'tzimpehua', // This is actually the better spelling, but the previous is much more common
  'xiquitta'
];

/////////////////////////////////////////////////
//
// arrayToRegexOptionGroup
//
// NOTE: This also sorts the array in place
//       in order to put longest options first
//       which is what you will want for proper
//       behavior in your regular expression.
//
/////////////////////////////////////////////////
function arrayToRegexOptionGroup(arr){
  // Sort to longest strings first.
  // Since we are sorting in descending order by
  // length, it seems reasonable to also do
  // the nested alphabetic sort in reverse order too.
  // This nested sort is not critical, but makes it a
  // little bit easier for human eyes:
  arr.sort( (a,b)=>{
    return b.length-a.length || b.localeCompare(a);
  });
  return '('+arr.join('|')+')';
}

// Turn the array into a regexp fragment with the OR operator '|' between each option:
const posAbbr = arrayToRegexOptionGroup(abbr);

///////////////////////////////////////
//
// formatAsSentence(s)
//
///////////////////////////////////////
function formatAsSentence(s) {
  if(!s){
    return 'BAD ENTRY';
  }
  // 1. Capitalize:
  s = s.charAt(0).toUpperCase() + s.slice(1);
  // 2. If there is no punctuation at the end,
  //    then add a period, '.':
  if(!s.match(/[?!\.]$/)){
    s += '.';
  }
  return s;
}


/////////////////////////////////////////
//
// MAIN
//
/////////////////////////////////////////


const inputFile = process.argv[2];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(inputFile)
});

/////////////////////////////////////
//
// lineReader ON LINE PROCESSOR:
//
/////////////////////////////////////
let count=0;
lineReader.on('line', function (line) {
  count++;
  console.log(`=== ${line} ===`);
  // 1. replace all "s.o." with "someone"; all "s.t." with "something":
  line = line.replace(/s\.o\./g,'someone');
  line = line.replace(/s\.t\./g,'something');
  // 2. Split on full stops:
  let arr  = line.split('.');
  // DEBUG ONLY: console.log(arr);
  // 3. Trim extra white space from entries in array:
  arr        = arr.map( el => el.trim() );
  while(arr[arr.length-1]===''){
    arr.pop(); // remove empty elements from end of array
  }
  
  // 4. Start parsing entries:
  const entry={};
  entry.hw  = arr[0];
  entry.pos = arr[1];
  entry.es  = [];
  entry.en  = [];
  if(entry.pos.match(/^Vea/)){
    entry.vea = entry.pos;
    entry.see = arr[2];
    return;
  }else if(entry.pos.match(/tlach/)){
    // This is a VERB entry, so should have a PAST TENSE FORM after the
    // 'tlach' part-of-speech:
    entry.preterit = arr[2];
    // THE FOLLOWING probably does not capture all but hopefully does 
    // capture many of the cases of a missing preterit form:
    if(entry.preterit.match(/^raíz/)){
      // Add a holder for preterit. There won't be any preterit form:
      arr.splice(2,0,'·'); // Unicode MIDDLE DOT U+00B7
    }else if(entry.preterit.match(/[A-Za-z] [A-Za-z]/)){
      // There are around 138 missing preterit entries even after 
      // removing the 'raíz' entries. We don't want to log this anymore
      // however. DEBUG: console.log(`BAD PRETERIT FORM: ${count} ${line}`);

      // Add a holder for preterit so the remaining array elements 
      // are in the right spots. There won't be any actual preterit 
      // here form:
      arr.splice(2,0,'·'); // Unicode MIDDLE DOT U+00B7
    }
    // Single or multiple definitions?
    if(!arr[3]){
      entry.es.push('BAD ENTRY');
      entry.en.push('BAD ENTRY');
      return;
    }
    if(arr[3].match(/[0-9]$/)){
      // multiple definitions:
      // Divide by four because (1) each definition consists of
      // two array elements: an ordinal and the definition itself
      // and (2) we expect to encounter both Spanish and English
      // definitions: two languages. Therefore 2x2=4, so we have:
      const defCount = (arr.length - 3)/4;
      // DEBUG ONLY: console.log(`DEF COUNT = ${defCount}`);
      // so we start at the 5th entry (zero-offset index 4) and
      // grab the definitions from every 2nd array element:
      for(let i=4, j=i+defCount*2;j<arr.length;i+=2,j+=2){
        entry.es.push(formatAsSentence(arr[i]));
        entry.en.push(formatAsSentence(arr[j]));
      }
    }else{
      // single:
      entry.es.push(formatAsSentence(arr[3]));
      entry.en.push(formatAsSentence(arr[4]));
    }
  }else{
    // This is NOT a verb entry, so should have definiton
    // in spanish beginning right after the part-of-speech entry:
    if(!arr[3]){
      console.log(`*** BAD ENTRY: ${count}: ${line}`);
      return;
    }
    if(arr[3].match(/[0-9]$/)){
      // multiple definitions:
      const defCount = (arr.length - 3)/4;
      // DEBUG ONLY: console.log(`DEF COUNT = ${defCount}`);
      // We start at the 5th entry (zero-offset index 4) and
      // grab the definitions from every 2nd array element:
      for(let i=4, j=i+defCount*2;j<arr.length;i+=2,j+=2){
        entry.es.push(formatAsSentence(arr[i]));
        entry.en.push(formatAsSentence(arr[j]));
      }
    }else{
      // single definition:
      entry.es.push(formatAsSentence(arr[2]));
      entry.en.push(formatAsSentence(arr[3]));
    }
  }
  console.log(entry);
});
