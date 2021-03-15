const NWT = require('./nahuatl_tools.js');
const nab = NWT.nab;
const nwt = NWT.nwt;
const alo = NWT.alo;

// Experimental:
const gmn = require('./geminate.js').gmn;

////////////////////////////////////////////////////////////////
//
// convertNahuatl()
//
// => Using a pipeline that handles capitalization correctly
//
////////////////////////////////////////////////////////////////
function convertNahuatl(inString){

  //const inString = ta_inp.value;
  if(!inString){
    //ta_hasler.value = '';
    //ta_sep.value    = '';
    //ta_ack.value    = '';
    //ta_trager.value = '';
    return;
  }  
  const metaWords = nwt.splitToMetaWords(inString);

  // CREATE RESULT SET CONTAINERS:
  let hmod=''; // Hasler Modern
  let sep =''; // SEP
  let ack =''; // ACK
  let tmod=''; // Trager Modern
  let ipa =''; // New IPA
  let atom=''; // Atomic
  let allo=''; // Allophonic

  // "Check boxes" to determine if capitalized words should be converted or not:
  let cb_hasler={}, cb_sep={},cb_ack={},cb_trager={},cb_atom={},cb_allo={};
  cb_hasler.checked=true; 
  cb_sep.checked=true;
  cb_ack.checked=true;
  cb_trager.checked=true;
  cb_atom.checked=true;
  cb_allo.checked=true;

  for(const metaWord of metaWords){
    // CONVERT WORDS TO OUTPUT ORTHOGRAPHIES:
    
    // EXPERIMENTAL: See if the word should have a geminated consonant:
    metaWord.atomic = gmn.findGeminate(metaWord.atomic);

    ////////////////////////////////////////
    //
    // "F" (PHONETIC) ORTHOGRAPHIES:
    //
    ////////////////////////////////////////
    //
    // APPLY ALLOPHONE RULES, EXCEPT WHEN EXCLUSIONS APPLY:
    //
    let allophonic = metaWord.atomic;
    //
    // TERMINAL /n/ TO [h] RULE:
    //
    if(!alo.n2h.exclude[allophonic]){
      allophonic = nwt.atomicAllophoneN2H(allophonic);
    }
    //
    // /w/ AS CODA TO [h] RULE:
    //
    allophonic = nwt.atomicAllophoneW2H(allophonic);
    //
    // /kw/ AS CODA TO [k] RULE:
    //
    allophonic = nwt.atomicAllophoneKw2K(allophonic);
    // 
    // DEGEMINATION: Do this as the last step:
    //
    allophonic = nwt.atomicToDegeminate(allophonic);
    
    // FINALLY WE CAN CONVERT FROM ALLOPHONIZED
    // ATOMIC TO DESTINATION "F" ORTHOGRAPHIES:
    let hhmod  = nwt.atomicToHaslerModern( allophonic );
    let ssep   = nwt.atomicToSEP( allophonic );
    
    
    //////////////////////////////////////////
    //
    // "M" (MORPHOPHONEMIC) ORTHOGRAPHIES:
    //
    //////////////////////////////////////////
    let aack   = nwt.atomicToACK( metaWord.atomic );
    let ttmod  = nwt.atomicToTragerModern( metaWord.atomic );

    // IPA:
    let iipa   = nwt.atomicToIPA( metaWord.atomic );
    
    // ATOMIC (NO CHANGE):
    let aatom  = metaWord.atomic;

    if(metaWord.flic){
      // FLIC: First letter is capitalized, so:
      
      // Hasler Modern:
      hmod += cb_hasler.checked ? nwt.capitalize(hhmod) : metaWord.original;
      // SEP:
      sep  += cb_sep.checked    ? nwt.capitalize(ssep ) : metaWord.original;
      // ACK:
      ack  += cb_ack.checked    ? nwt.capitalize(aack ) :  metaWord.original;
      // IPA: ignore capitalization for IPA:
      ipa  += iipa;
      // ATOM: Treat just like the others so that examples with names can be atomized:
      atom += cb_atom.checked   ? nwt.capitalize(aatom) : metaWord.original;
      // ALLO:
      allo += cb_allo.checked   ? nwt.capitalize(allophonic) : metaWord.original;

      // TRAGER:
      if(cb_trager.checked){
        ///////////////////////////////////////////////////////////////////////////
        //
        // TRAGER 
        //
        // NOTA BENE: Test for deity first because a few deity names look like 
        // they have place name suffixes:
        //
        ///////////////////////////////////////////////////////////////////////////
        if( metaWord.isDeity ){
          tmod += nab.prefixDeity + ttmod;
        }else if( metaWord.isPlace ){
          // Quite likely a place name:
          tmod += nab.prefixPlace + ttmod;
        }else if( metaWord.isPerson ){
          //console.log('processing person '+metaWord.original);
          tmod += nab.prefixName + ttmod;
        }else{
          tmod += ttmod;
        }
      }else{
        // Checkbox *NOT* checked, so don't convert. But for Trager, if
        // it does not register as a diety or name or place, then *DO* convert:
        if( metaWord.isDiety || metaWord.isPerson || metaWord.isPlace ){
          tmod += metaWord.original;
        }else{
          tmod += ttmod;
        }
      }
    }else{
      // NOT CAPITALIZED:
      hmod += hhmod;
      sep  += ssep ;
      ack  += aack ;
      tmod += ttmod;
      // IPA: ignore capitalization for IPA:
      ipa  += iipa;
      // ATOM: also ignoring capitalization:
      atom += aatom;
      allo += allophonic;
    }
    hmod += ' ';
    sep  += ' ';
    ack  += ' ';
    tmod += ' ';
    ipa  += ' ';
    atom += ' ';
    allo += ' ';
  }


  // Show the results:
  //ta_hasler.value = hmod;
  //ta_sep.value    = sep;
  //ta_ack.value    = ack;
  //ta_trager.value = tmod;
  hmod = hmod.trim();
  sep  = sep.trim();
  ack  = ack.trim();
  tmod = tmod.trim();
  ipa  = ipa.trim();
  atom = atom.trim();
  allo = allo.trim();
  return { hasler:hmod,sep:sep,ack:ack,trager:tmod,ipa:ipa,atom:atom,allo:allo }

}

////////////////////
//
// MAIN
//
////////////////////
if(process.argv.length!=3){
  console.log("Please specify a word or phrase to convert on the command line.");
  return 1;
}

const input=process.argv[2];
console.log(`INPUT: ${input}`);
// Force to Unicode normalized precomposed forms:
const nfcForm = input.normalize('NFC');
const result = convertNahuatl(nfcForm);

console.log(result);
console.log('SYLLABIFIED:');
console.log(nwt.atomicToIPAPhonetic(result.allo));
return 0;

