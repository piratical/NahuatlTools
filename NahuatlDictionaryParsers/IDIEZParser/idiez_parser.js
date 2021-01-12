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

if(process.argv.length != 3){
  console.log('Please specify file to read.');
  process.exit(1);
}

// REGEXP PATTERNS FOR DISCARDABLE STUFF:
// This includes blank lines as well as the page headwords and page number:
const discardable = new RegExp('^\u000c* *$|^\u000c*[A-ZĀĒĪŌŪ]+[1-9]?$|^\u000c*[1-9]{1,3}$');

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
//console.log(posAbbr);
// REGEXPS FOR DATA COLLECTION:
const startOfEntryPattern  = new RegExp(`^([A-ZĀĒĪŌŪ]+[1-9]?). ${posAbbr}\.? (.+)$`);

// Accumulator class to save data in for multiline reads:
class Accumulator {
  // constructor
  constructor(entry,pos,def){
    this.entry=entry;
    this.pos=pos;
    this.def=def;
  }

  // reset:
  reset(){
    this.entry='';
    this.pos  ='';
    this.def  ='';
  }
  
  // set
  set(entry='',pos='',def=''){
    this.entry=entry;
    this.pos=pos;
    this.def=def;
  }

  // addToDefinition
  addToDefinition(s){
    s = s.trim();
    if( s.length === 0 ){
      return;
    }
    if(this.def && this.def.length && this.def.substr(this.def.length-1)!=' '){
      this.def += ' ';
    }
    this.def += s;
  }
  
  // write
  write(){
    if(this.entry || this.pos || this.def){
      console.log(`${this.entry}\t${this.pos}\t${this.def}`);
    }
  }
  
  // copy (copy constructor):
  copy(){
    return new Accumulator(this.entry,this.pos,this.def);
  }
}

// Global reusable container to accumulate the parts of an entry:
const accumulator = new Accumulator();

// On the first pass through, put all entries into this:
const accumulatorArray = [];

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
  //console.log(count++);
  // STUFF TO DISCARD:
  const discard = line.match(discardable);
  if( discard ){
    //console.log(`DISCARDING:${match[0]}`);
    return;
  }
  
  // DATA TO SAVE:
  const entry = line.match(startOfEntryPattern);
  if( entry ){
    //console.log(`MATCHED: ${entry[1]}`);
    //console.log(entry);
    // Start of a new entry, so first write out the existing entry:
    if(accumulator.entry){
      accumulatorArray.push( accumulator.copy() );
      //accumulator.write();
    }
    // Set new entries:
    accumulator.set(entry[1],entry[2],entry[3]);
    //console.log(accumulator);
  }else if(line.length && line.trim()){
    //console.log(`LINE ${count}: ${line}`);
    //console.log(`=== ${accumulator.entry} ===`);
    //console.log(`BEFORE=${accumulator.def}`);
    accumulator.addToDefinition(line);
    //console.log(`AFTER=${accumulator.def}`);
  }
});

/////////////////////////////////////
//
// lineReader ON CLOSE PROCESSING:
//
/////////////////////////////////////
lineReader.on('close',function(){
  //
  // Push the very last entry:
  //
  if(accumulator.entry){
    accumulatorArray.push( accumulator.copy() );
  }

  ///////////////////////////////////
  //
  // Start the next processing step:
  // Here we do additional processing on
  // each entry to break it up properly
  // into all the relevant pieces.
  // Most importantly, the examples and
  // the "también se dice"s are broken out
  // from the definitions.
  ///////////////////////////////////
  accumulatorArray.forEach( entry =>{
    // Let's start by splitting the "def"
    // block into constituent numbered definitions.
    // When not numbered, we just get one resulting
    // definition block in the array:
    entry.def = entry.def.split(/ *[1-9]\. /);
    // Remove the artifacts of empty string entries
    // at position zero, if such are present:
    if(entry.def[0]===''){
      //console.log('Fixing ...');
      entry.def.splice(0,1);
    }
    // Start processing each split definition:
    for(let i=0;i<entry.def.length;i++){
      const parts = entry.def[i].split(' "');
      //console.log(`DEF_EJ: ${parts.length}`);
      //console.log(parts);
      if(parts.length===2){
        entry.def[i]= { def:parts[0] , ej:parts[1] };
      }else{
        entry.def[i]= { def:parts[0] };
      }
    };
    
  });
  //
  // JSONIFIED OUTPUT:
  //
  console.log(JSON.stringify(accumulatorArray,null,1));
  console.log(accumulatorArray.length);
});

