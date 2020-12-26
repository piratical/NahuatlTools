const NWT = require('./nahuatl_tools.js');
const nab = NWT.nab;
const nwt = NWT.nwt;

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

  // "Check boxes" to determine if capitalized words should be converted or not:
  let cb_hasler={}, cb_sep={},cb_ack={},cb_trager={};
  cb_hasler.checked=false; 
  cb_sep.checked=false;
  cb_ack.checked=false;
  cb_trager.checked=false;

  for(const metaWord of metaWords){
    // CONVERT WORDS TO OUTPUT ORTHOGRAPHIES:
    let hhmod  = nwt.atomicToHaslerModern( metaWord.atomic );
    let ssep   = nwt.atomicToSEP( metaWord.atomic );
    let aack   = nwt.atomicToACK( metaWord.atomic );
    let ttmod  = nwt.atomicToTragerModern( metaWord.atomic );
    let iipa   = nwt.atomicToIPA( metaWord.atomic );
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
      hmod += hhmod;
      sep  += ssep ;
      ack  += aack ;
      tmod += ttmod;
      // IPA: ignore capitalization for IPA:
      ipa  += iipa;
    }
    hmod += ' ';
    sep  += ' ';
    ack  += ' ';
    tmod += ' ';
    ipa  += ' ';
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
  return { hasler:hmod,sep:sep,ack:ack,trager:tmod,ipa:ipa }

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
const result = convertNahuatl(input);

console.log(result);
return 0;

