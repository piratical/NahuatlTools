//////////////////////////////////////////////////////////////////////////////////////
//
// Parser to parse out "El Vocabulario básico 
// Náhuatl-Español. Material de apoyo didáctico 
// para niñas y niños indígenas de Educación Básica"
// elaborado por el Mtro. Fernando Silva Hernández
// SEP 2014 Estado de Hidalgo
// https://www.gob.mx/cms/uploads/attachment/file/3050/vocabulario_nahuatl_WEB.pdf 
//
// This parser (c) 2020, 2021 by Edward H. Trager. ALL RIGHTS RESERVED
//
//////////////////////////////////////////////////////////////////////////////////////
const fs       = require('fs');
const readline = require('readline');

if(process.argv.length != 3){
  console.log('Please specify file to read.');
  process.exit(1);
}

// REGEXP PATTERNS FOR DISCARDABLE STUFF:
const p1 = new RegExp('^.? +[A-Z]$');
const p2 = new RegExp('^ +[0-9]+$');
const p3 = new RegExp('^vocabulario nahuatl.indd');

// Parts of speech abbreviations list from the PDF:
// These are listed from longest to shortest to insure proper
// matching behavior:
const abbr=[
"adj. calif.",
"adj.",
"adv. a.",
"adv. d.",
"adv. c.",
"adv. l.",
"adv. m.",
"adv. n.",
"adv. t.",
"adv.",
"af.",
"aux.",
"conj.",
"dim.",
"f.",
"int.",
"g.",
"m.",
"morf.",
"n.",
"neg.",
"neol.",
"pref. pron. pos.",
"pref. pron. ref.",
"pref. dim.",
"pref. d.",
"pref. n.",
"pref.",
"prep.",
"pres. p.",
"pres.",
"pret.",
"pron. interr.",
"pron. d.",
"pron. i.",
"pron. p.",
"pron. r.",
"r.",
"t. lit.",
"vb. frec.",
"vb. d.",
"vb. t.",
"vb."
];
// Turn the array into a regexp fragment with the OR operator '|' between each option:
const abbr1 = abbr.join('|');
const abbrs = abbr1.replace(/\./g,'\\\.');

// REGEXPS FOR DATA COLLECTION:
const startOfEntryPattern  = new RegExp(`^ +(\\w+)\. (${abbrs}) +(.+)$`);
const tambienSeDicePattern = /(.*) +[Tt]ambién se dice:? *(.*)/;
const ejemploPattern       = /(.*) +[Ee]jemplos?:? *(.*)/;

const allEntries = [];

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
    if(this.def.length && this.def.substr(this.def.length-1)!=' '){
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
lineReader.on('line', function (line) {
  // STUFF TO DISCARD:
  if( line.match(p1) ){
    return;
  }
  if( line.match(p2) ){
    return;
  }
  if( line.match(p3) ){
    return;
  }
  // DATA TO SAVE:
  const entry = line.match(startOfEntryPattern);
  //console.log(entry);
  if( entry ){
    // Start of a new entry, so first write out the existing entry:
    if(accumulator.entry){
      accumulatorArray.push( accumulator.copy() );
      //accumulator.write();
    }
    // Set new entries:
    accumulator.set(entry[1],entry[2],entry[3]);
  }else if(line.length && line.trim()){
    accumulator.addToDefinition(line);
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
    const tambien  = entry.def.match(tambienSeDicePattern);
    if(tambien){
      entry.def     = tambien[1];
      entry.tambien = tambien[2];
    }else{
      entry.tambien = '';
    }
    const ejemplos = entry.def.match(ejemploPattern);
    if(ejemplos){
      entry.def = ejemplos[1];
      entry.ejemplos = ejemplos[2];
      // Segment all the examples at the semicolons:
      const many = entry.ejemplos.split('; ');
      // Then split each one into the nahuatl and spanish
      // parts at the first comma:
      const segmentedExamples = [];
      many.forEach( example => {
        const parts = example.split(', ');
        segmentedExamples.push({nah:parts[0],es:parts[1]});
      });
      // Replace entry.ejemplos with the nicely JSONified segmentedExamples:
      entry.ejemplos = segmentedExamples;
      //console.log(entry.ejemplos);
      //console.log(segmentedExamples);
      //console.log('==========');
    }else{
      entry.ejemplos = [];
    }
    //console.log(entry);
    //console.log(`${entry.entry}\t${entry.pos}\t${entry.def}\tEJEMPLO=${entry.ejemplos}\tTAMBIEN=${entry.tambien}`);
  
  });
  //
  // JSONIFIED OUTPUT:
  //
  console.log(JSON.stringify(accumulatorArray,null,1));
});
