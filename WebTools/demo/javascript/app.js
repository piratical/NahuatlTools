
// References to the TEXTAREA nodes:
const ta_inp    = document.getElementById('input' );
const ta_ack    = document.getElementById('ack'   );
const ta_hasler = document.getElementById('hasler');
const ta_trager = document.getElementById('trager');
const ta_sep    = document.getElementById('sep'   );

// References to the convert proper names checkboxes:
const cb_ack    = document.getElementById('ack_cn');
const cb_hasler = document.getElementById('hmod_cn');
const cb_trager = document.getElementById('tmod_cn');
const cb_sep    = document.getElementById('sep_cn' );

////////////////////////////////////////////////////////////////
//
// convertNahuatl()
//
// => Using a pipeline that handles capitalization correctly
//
////////////////////////////////////////////////////////////////
function convertNahuatl(){

  const inString = ta_inp.value;
  if(!inString){
    ta_hasler.value = '';
    ta_sep.value    = '';
    ta_ack.value    = '';
    ta_trager.value = '';    
    return;
  }  
  const metaWords = nwt.splitToMetaWords(inString);

  // CREATE RESULT SET CONTAINERS:
  let hmod=''; // Hasler Modern
  let sep =''; // SEP
  let ack =''; // ACK
  let tmod=''; // Trager Modern

  for(const metaWord of metaWords){
    // CONVERT WORDS TO OUTPUT ORTHOGRAPHIES:
    let hhmod  = nwt.atomicToHaslerModern( metaWord.atomic );
    let ssep   = nwt.atomicToSEP( metaWord.atomic );
    let aack   = nwt.atomicToACK( metaWord.atomic );
    let ttmod  = nwt.atomicToTragerModern( metaWord.atomic );
    if(metaWord.flic){
      // FLIC: First letter is capitalized, so:
    
      // Hasler Modern:
      hmod += cb_hasler.checked ? nwt.capitalize(hhmod) : metaWord.original;
      // SEP:
      sep  += cb_sep.checked    ? nwt.capitalize(ssep ) : metaWord.original;
      // ACK:
      ack  += cb_ack.checked    ? nwt.capitalize(aack ) :  metaWord.original;
    
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
    }
    hmod += ' ';
    sep  += ' ';
    ack  += ' ';
    tmod += ' ';
  }


  // Show the results:
  ta_hasler.value = hmod;
  ta_sep.value    = sep;
  ta_ack.value    = ack;
  ta_trager.value = tmod;

}

// EVENT LISTENER:
ta_inp.addEventListener('input',convertNahuatl);

// Also run the conversion when checkbox changes:
cb_hasler.addEventListener('input',convertNahuatl);
cb_trager.addEventListener('input',convertNahuatl);
cb_ack.addEventListener('input',convertNahuatl);
cb_sep.addEventListener('input',convertNahuatl);

