///////////////////////////////////////////////////
//
// zongolica_parser.js
//
// (c) 2020, 2021 by Edward H. Trager
// <ed.trager@gmail.com> All Rights Reserved
//
// This NODE.JS script has been specifically designed to parse
// out the entries in the Nahuatl-Español dictionary
// "TLAHTOLNECHIKOLLI DICCIONARIO NAWATL MODERNO - ESPAÑOL
// DE LA SIERRA DE ZONGOLICA VER." by EUTIQUIO GERÓNIMO SÁNCHEZ,
// EZEQUIEL JIMENEZ ROMERO,EZEQUIEL JIMENEZ ROMERO, 
// RAMÓN TEPOLE GONZÁLEZ, ANDRÉS HASLER HANGERT,
// AQUILES QUIAHUA MACUIXTLE and JORGE LUIS HERNANDEZ
// which can be found online at:
//
// http://www.vcn.bc.ca/prisons/dicc-zon.pdf
//
// The procedure is as follows:
//
// (1) Convert the PDF to a text file using
// "pdftotext" (Poppler Developers http://poppler.freedesktop.org 
// & Glyph & Cog, LLC). Other tools may also work. 
// I used version 0.57.0 as follows:
//
// ~> pdftotext dicc-zon.pdf dicc-zon.txt
//
// (2) Run this script against the text file:
//
// ~> node ./zongolica_parser.js dicc-zon.txt > results.json
//
// Results are in JSON format, e.g.:
// 
// ...
// {
//   "entry": "AHWILIA, AHWILIH, AHWILI",
//   "pos": "v.4",
//   "def": "Echar agua.",
//   "ejemplos": [
//    {
//     "nah": "okahwilih",
//     "es": "le echó agua ."
//    }
//   ],
//   "synonyms": "atekia"
//  },
//  ...
//
///////////////////////////////////////////////////

const fs       = require('fs');
const readline = require('readline');

if(process.argv.length != 3){
  console.log('Please specify file to read.');
  process.exit(1);
}

// REGEXP PATTERNS FOR DISCARDABLE STUFF:
const p1 = new RegExp('^ *$');

// Parts of speech abbreviations list from the PDF:
// These are listed from longest to shortest to insure proper
// matching behavior:
const abbr=[
'v.1, intr.',
'part.',
'pron.',
'expr. adj.',
'expr.',
'frec.',
'cont.',
'adj.',
'adv.',
'hon.',
'Sin.',
'imp.',
'v[ée]a.',
'dir.',
'lit.',
'v.1',
'v.2',
'v.3',
'v.4',
'v.5',
'ap.',
'Ej.',
'pl.',
's.',
'R.',
];
// Turn the array into a regexp fragment with the OR operator '|' between each option:
const abbr1 = abbr.join('|');
const abbrs = abbr1.replace(/\./g,'\\\.');

// REGEXPS FOR DATA COLLECTION:
const startOfEntryPattern    = new RegExp(`^([A-Z, ]+[¡!]?) +(${abbrs})( *– *)?(.+)?$`);
const startOfVeaEntryPattern = new RegExp(`^([A-Z, ]+[¡!]?) +[Vv][ée]a\.? *(.+)?$`);

const allEntries = [];

// Accumulator class to save data in for multiline reads:
class Accumulator {
  // constructor
  constructor(entry='',pos='',def=''){
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

////////////////////////////
//
// subentryMarkers
//
////////////////////////////
const subentryMarkers  = [' *R. *',' *Ej. *',' *[Vv][ée]a *',' *Dícese *',' *Sin. *'] ;
const subentryTypes    = ['roots','ejemplos','see','also_said','synonyms'];

////////////////////////////////////////////
//
// splitAtMarkers
//
////////////////////////////////////////////
function splitAtMarkers(arrayOfMarkers,text){
  // Use regexp vertical bar '|' to separate the individual markers:
  const se_pattern_raw   = arrayOfMarkers.join('|');
  // Treat periods as actual periods, not regexp wildcards:
  const se_pattern       = se_pattern_raw.replace(/\./g,'\\\.');
  // Add parentheses and create the regexp pattern of the options:
  const se_split_pattern = new RegExp(`(${se_pattern})`);
  // Then simply split the text wherever any of the markers occurs:
  const split1 = text.split(se_split_pattern);
  // The marker pattern may have contained whitespace, which we don't need to preserve:
  for(let i=0;i<split1.length;i++){
    split1[i]=split1[i].trim(); 
  };
  return split1;
}

/////////////////////////////
//
// splitExamples
//
/////////////////////////////
function splitExamples(str){
  // Segment all the examples at the semicolons:
  const many = str.split('; ');
  // Then split each one into the nahuatl and spanish
  // parts at the first comma:
  const segmentedExamples = [];
  many.forEach( example => {
    const parts = example.split(' – ');
    segmentedExamples.push({nah:parts[0],es:parts[1]});
  });
  // Return the JSONified segmentedExamples:
  return segmentedExamples;
}

/////////////////////////////
//
// splitRoots
//
/////////////////////////////
function splitRoots(str){
  // Segment all the Roots at the commas:
  const roots = str.split(', ');
  // Return the array of roots:
  return roots;
}




/////////////////////////////////
//
// START OF MAIN
//
//////////////////////////////////
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
  // DATA TO SAVE:
  const entry = line.match(startOfEntryPattern);
  const vea   = line.match(startOfVeaEntryPattern);
  if( entry ){
    // Start of a new entry, so first write out the existing entry:
    if(accumulator.entry){
      accumulatorArray.push( accumulator.copy() );
      //accumulator.write();
    }
    // Set new entry into accumulator:
    accumulator.set(entry[1],entry[2],entry[4]);

  }else if( vea ){
    if(accumulator.entry){
      accumulatorArray.push( accumulator.copy() );
    }
    // Set new entry into accumulator:
    accumulator.set(vea[1],'véa','véa '+vea[2]);
    
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
    // Split the entry into possibly several sub entries according to
    // the markers in the subentryMarkers array:
    const resultArray = splitAtMarkers(subentryMarkers,entry.def);
    // First string is the definition:
    entry.def = resultArray[0];
    // Possible sub entries are as noted previously.
    // We make no assumption about in what order the subentries actually
    // appear or how many of them there are, hence we have this. Note that
    // when a marker is matched, then the value for that subentry is in
    // the following array entry:
    for(let i=1;i<resultArray.length;i+=2){
      for(let j=0;j<subentryMarkers.length;j++){
        if(resultArray[i].match(new RegExp(subentryMarkers[j]))){
           entry[subentryTypes[j]]=resultArray[i+1];
        }
      }
    }
    
    // Segment ejemplos:
    if(entry.ejemplos){
      entry.ejemplos = splitExamples(entry.ejemplos);
    }
    // Segment roots:
    if(entry.roots){
      entry.roots = entry.roots.replace('.','');
      entry.roots = splitRoots(entry.roots);
    }
    // See:
    if(entry.see){
      entry.see = entry.see.replace('.','');
    }
    // Synonyms:
    if(entry.synonyms){
      entry.synonyms = entry.synonyms.replace('.','');
    }
  });
  //
  // JSONIFIED OUTPUT:
  //
  console.log(JSON.stringify(accumulatorArray,null,1));
});
