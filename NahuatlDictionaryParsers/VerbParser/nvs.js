

///////////////////////////////
//
// NVS: Nahuatl verb segmenter 
// command line interface
//
///////////////////////////////

// ES6 import:
import { convertNahuatl } from './noce/noce.js';
import { segment        } from './verb_parser3.js';

if(process.argv.length!=3){
  console.error('Nahuatl verb parser (c) 2022 by Edward H. Trager.');
  console.error('Please specify a verb form to test on the command line');
  process.exit(1);
}

//
// formatSegmentation(): Formats the segmentObject for printing
//
function formatSegmentation( segmentObject ){
  let s='';
  const marker='•';
  const sttColor = '\u001b[35m' ;
  const endColor = '\u001b[0m'  ;
  
  segmentObject.prefixes.forEach( prefix =>{ s += prefix + marker; } );
  
  s += sttColor;
  s += segmentObject.stem;
  s += endColor;
  
  segmentObject.suffixes.forEach( suffix =>{ s += marker + suffix; } );
  
  // Preterit to present mapping:
  if(segmentObject.present){
    s += ` (${segmentObject.present})`;
  }
  return s;
}

// The verb form to process:
const verbForm     = process.argv[2];
const atomic       = convertNahuatl(verbForm);
const segmentation = segment( atomic['atom'] );
const display      = formatSegmentation(segmentation);
console.log(display);

