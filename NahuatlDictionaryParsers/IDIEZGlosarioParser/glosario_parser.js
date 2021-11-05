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
  line = line.replace('s.o.','someone');
  line = line.replace('s.t.','something');
  // 2. Split on full stops:
  let arr  = line.split('.');
  console.log(arr);
  // 3. Trim extra white space from entries in array:
  arr        = arr.map( el => el.trim() );
  
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
    entry.past = arr[2];
    // Single or multiple definitions?
    if(arr[3].match(/[0-9]$/)){
      // multiple definitions:
      const defCount = (arr.length - 3)/4;
      console.log(`DEF COUNT = ${defCount}`);
      for(let idx=4;idx<arr.length;idx+=2){
        //entry.es.
      }
    }else{
      // single:
      entry.es.push(arr[3]);
      entry.en.push(arr[4]);
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
    }else{
      // single definition:
      entry.es.push(arr[2]);
      entry.en.push(arr[3]);
    }
  }
  console.log(entry);
});
