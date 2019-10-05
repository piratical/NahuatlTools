////////////////////////////////////////
//
// nahuatl_tools.js
//
// (c) 2019 by Edward H. Trager
//     ALL RIGHTS RESERVED
//
// (c) 2019 por Edward H. TRAGER
//     TODOS LOS DERECHOS RESERVADOS
//
// This is FREE/LIBRE SOFTWARE published 
// under the GNU GPL License version 2.0
// or later.
//
// Este es software LIBRE publicado bajo 
// la licencia GNU GPL versión 2.0 
// o posterior.
//
// INITIAL DATE: 2019.09.13 ET
//
////////////////////////////////////////

///////////////////////////////////////////
//
// CURRENT ABUGIDA CODE POINTS SECTION:
//
///////////////////////////////////////////
const nab={
  //////////////////////////////////////////////////////////////
  //
  // CURRENT ABUGIDA CODE ASSIGNMENTS
  //
  // CURRENTLY THESE ARE PRIVATE USE AREA
  // (PUA) ASSIGNMENTS USED IN THE 
  // NahuatlOne font:
  // (Assignments taken from the Nahuatl Tools C++ Transcoder)
  //
  //////////////////////////////////////////////////////////////
  // Vowels:
  vowelA:'\uED90',
  vowelE:'\uED91',
  vowelI:'\uED92',
  vowelO:'\uED93',
  vowelU:'\uED94',
  // Long Vowel Sign:
  longVowelSign:'\uED95',
  // Vowel Signs:
  vowelSignA:'\uEDA0',
  vowelSignE:'\uEDA1',
  vowelSignI:'\uEDA2',
  vowelSignO:'\uEDA3',
  vowelSignU:'\uEDA4',
  // Native Consonants:
  consonantMA:'\uEDB0',
  consonantNA:'\uEDB1',
  consonantPA:'\uEDB2',
  consonantTA:'\uEDB3',
  consonantCA:'\uEDB4',
  consonantCUA:'\uEDB5',
  consonantTZA:'\uEDB6',
  consonantTLA:'\uEDB7',
  consonantCHA:'\uEDB8',
  consonantSA:'\uEDB9',
  consonantXA:'\uEDBA',
  consonantHA:'\uEDBB',
  consonantLA:'\uEDBC',
  consonantWA:'\uEDBE',   // Note WA WITZITZILIN (HUITZITZILIN) should come before YA in sorted order
  consonantYA:'\uEDBD',   // Note YA YOHUALLI should be the last letter in the native consonant series
  // Additional Spanish Consonants:
  consonantNYA:'\uEDC0',
  consonantBVA:'\uEDC1',
  consonantDA:'\uEDC2',
  consonantGA:'\uEDC3',
  consonantFA:'\uEDC4',
  consonantRA:'\uEDC5',
  consonantRRA:'\uEDC6',
  // Compound (Dipthong) Vowel Signs:
  vowelSignIA:'\uEDA5',
  vowelSignAI:'\uEDA6',
  vowelSignOA:'\uEDA7',
  vowelSignEO:'\uEDA8',
  vowelSignEI:'\uEDA9',
  vowelSignIO:'\uEDAA', // 2017.01.20.ET addendum
  vowelSignAO:'\uEDAC', // 2019.06.25.ET addendum
  // Subjoiner sign:
  subjoinerSign:'\uEDAB',
  // Special Prefix signs:
  prefixPlace:'\uEDAD',
  prefixName:'\uEDAE',
  prefixDiety:'\uEDAF',
  ///////////////////////////////////////////////////////
  //
  // END OF ABUGIDA CURRENT PUA CODE POINT ASSIGNMENTS
  //
  ///////////////////////////////////////////////////////
};

/////////////////////
//
// nab.map
//
/////////////////////
const nabMap={
  atomicVowelToVowelSign:{
    'a':nab.vowelSignA,
    'e':nab.vowelSignE,
    'i':nab.vowelSignI,
    'o':nab.vowelSignO
  }
}

// namespace "nwt" :
const nwt={
  ///////////////////////////////////////////////////////////
  // 
  // NOTA BENE:
  // 
  // (1) We introduce an internal
  // code-use-only "computational" orthography that is
  // based on a modern Hasler orthography but where we
  // reduce the digraphs to single Unicode code points
  // with the goal of simplifying at least some of the
  // mapping and translation code. We call this ATOMIC.
  //
  // (2) Mapping to the abugida and to ACK requires additional
  // processing, but the first step is an initial symbolic
  // mapping that is identical to mapping to the Latin-based
  // orthographies.
  // 
  // (3) HMOD is our version of Hasler Modern 
  // using 'w' for [w] and 'h' for [ʔ]
  // 
  // (4) ACK  is Andrews-Campbell-Kartunnen 
  // "ACK" appears to have been coined by Sullivan & Olko
  //
  // (5) SEP is SEP using 'u' for [w] and 'j' for [ʔ]
  //
  // (6) INTR: (internet/intuitive) is like #3 but using sh for [ʃ]
  // 
  // (7) We are also going to try to have a generic reader/transcoder
  //
  ///////////////////////////////////////////////////////////
  // 
  // STT MAP SECTION
  map:{
    // STT ATOMIC mapping:
    atomic:{
      // NATIVE VOWELS:
      'a':{hmod:'a',ack:'a',sep:'a',intr:'a',nab:nab.vowelA},
      'e':{hmod:'e',ack:'e',sep:'e',intr:'e',nab:nab.vowelE},
      'i':{hmod:'i',ack:'i',sep:'i',intr:'i',nab:nab.vowelI},
      'o':{hmod:'o',ack:'o',sep:'o',intr:'o',nab:nab.vowelO},
      // FOREIGN VOWEL:
      'u':{hmod:'u',ack:'u',sep:'u',intr:'u',nab:nab.vowelU},
      // NATIVE CONSONANTS:
      'm':{hmod:'m',ack:'m',sep:'m',intr:'m',nab:nab.consonantMA},
      'n':{hmod:'n',ack:'n',sep:'n',intr:'n',nab:nab.consonantNA},
      'p':{hmod:'p',ack:'p',sep:'p',intr:'p',nab:nab.consonantPA},
      't':{hmod:'t',ack:'t',sep:'t',intr:'t',nab:nab.consonantTA},
      'k':{hmod:'k',ack:'c',sep:'k',intr:'k',nab:nab.consonantCA},
      'κ':{hmod:'ku',ack:'cu',sep:'ku',intr:'ku',nab:nab.consonantCUA}, // greek kappa          for [kʷ]
      'ʔ':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA}, // [ʔ]
      'τ':{hmod:'tz',ack:'tz',sep:'ts',intr:'tz',nab:nab.consonantTZA}, // greek tau            for [t͡s]
      'λ':{hmod:'tl',ack:'tl',sep:'tl',intr:'tl',nab:nab.consonantTLA}, // greek lambda         for [t͡ɬ]
      'ς':{hmod:'ch',ack:'ch',sep:'ch',intr:'ch',nab:nab.consonantCHA}, // terminal greek sigma for [t͡ʃ]
      's':{hmod:'s',ack:'s',sep:'s',intr:'s',nab:nab.consonantSA},
      'l':{hmod:'l',ack:'l',sep:'l',intr:'l',nab:nab.consonantLA},
      'x':{hmod:'x',ack:'x',sep:'x',intr:'sh',nab:nab.consonantXA}, // [ʃ]
      'h':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA}, // [h]
      'y':{hmod:'y',ack:'y',sep:'y',intr:'y',nab:nab.consonantYA}, // [j]
      'w':{hmod:'w',ack:'hu',sep:'u',intr:'w',nab:nab.consonantWA}, // [w]
      // FOREIGN CONSONANTS:
      'ñ':{hmod:'ñ',ack:'ñ',sep:'ñ',intr:'ñ',nab:nab.consonantNYA},
      'β':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA},
      'd':{hmod:'d',ack:'d',sep:'d',intr:'d',nab:nab.consonantDA},
      'g':{hmod:'g',ack:'g',sep:'g',intr:'g',nab:nab.consonantGA},
      'f':{hmod:'f',ack:'f',sep:'f',intr:'f',nab:nab.consonantFA},
      'r':{hmod:'r',ack:'r',sep:'r',intr:'r',nab:nab.consonantRA}, // 'r'
      'ρ':{hmod:'rr',ack:'rr',sep:'rr',intr:'rr',nab:nab.consonantRRA} // 'rr'
    },
    // END ATOMIC SECTION

    ////////////////////////
    //
    // STT ACK SECTION
    //
    ////////////////////////
    ack_to_atomic:{
      'cuh':'κ', // /kʷ/ consonant
      'hu':'w',
      'uh':'w',
      'qu':'k',
      'cu':'κ', // /kʷ/ consonant
      'ce':'se',
      'ci':'si',
      'ku':'κ', // /kʷ/ consonant modern orthography
      'kw':'κ', // /kʷ/ consonant modern variant orthography
      'uc':'κ', // /kʷ/ consonant
      'tz':'τ', // /t͡s/ consonant
      'ts':'τ', // /t͡s/ consonant modern orthography
      'tl':'λ', // /t͡ɬ/ consonant
      'ch':'ς', // /t͡ʃ/ consonant
      // FOREIGN CONSONANTS:
      'rr':'ρ',
      // ALTERNATIVE SPELLINGS:
      'ç':'s',
      'z':'s'
    },
    // END ACK SECTION
    
    ////////////////////////
    //
    // STT SEP SECTION
    //
    ////////////////////////
    sep_to_atomic:{
      'ku':'κ', // /kʷ/ consonant
      'ts':'τ', // /t͡s/ consonant
      'tz':'τ', // /t͡s/ consonant
      'tl':'λ', // /t͡ɬ/ consonant
      'ch':'ς', // /t͡ʃ/ consonant
      'sh':'x', // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      'rr':'ρ',
      // SINGLE GRAPH CONVERSIONS:
      'u':'w',  // 
      'j':'h'   // /h/ and glottal stop
    },
    // END SEP SECTION
    
    ////////////////////////
    //
    // STT HASLER MODERN SECTION
    //
    ////////////////////////
    hasler_to_atomic:{
      'ku':'κ', // /kʷ/ consonant
      'ts':'τ', // /t͡s/ consonant
      'tz':'τ', // /t͡s/ consonant
      'tl':'λ', // /t͡ɬ/ consonant
      'ch':'ς', // /t͡ʃ/ consonant
      'sh':'x', // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      'rr':'ρ'
    },
    // END HASLER MODERN SECTION
    
    /////////////////////////////////
    //
    // STT GENERAL ATTEMPT SECTION
    //
    /////////////////////////////////
    general_to_atomic:{
      'cuh':'κ', // /kʷ/ consonant
      'hu':'w',
      'uh':'w',
      'qu':'k',
      'cu':'κ', // /kʷ/ consonant
      'ca':'ka',
      'co':'ko',
      'ce':'se',
      'ci':'si',
      'ku':'κ', // /kʷ/ consonant modern orthography
      'kw':'κ', // /kʷ/ consonant modern variant orthography
      'uc':'κ', // /kʷ/ consonant
      'tz':'τ', // /t͡s/ consonant
      'ts':'τ', // /t͡s/ consonant modern orthography
      'tl':'λ', // /t͡ɬ/ consonant
      'ch':'ς', // /t͡ʃ/ consonant
      // SINGLE CHARACTERS:
      'c':'k',
      // FOREIGN CONSONANTS:
      'rr':'ρ',
      // ALTERNATIVE SPELLINGS:
      'ç':'s',
      'z':'s',
      'sh':'x', // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      'rr':'ρ',
      // SINGLE GRAPH CONVERSIONS:
      'u':'w',  // 
      'j':'h'   // /h/ and glottal stop
    }

  },
  // END MAP SECTION

  //////////////////////////
  // 
  // isAtomicVowel
  //
  //////////////////////////
  isAtomicVowel:function(atomicLetter){
    return 'aeiou'.indexOf(atomicLetter) != -1 ;
  },
  isSomethingElse:function(somethingElse){
    return ' .?"1234567890'.indexOf(somethingElse) != -1 ;
  },
  //////////////////////////
  // 
  // isAtomicConsonant
  //
  //////////////////////////
  isAtomicConsonant:function(something){
    return !(nwt.isAtomicVowel(something) || nwt.isSomethingElse(something));
  }
};

if(process.argv.length<3){
  console.log('No string to process');
  return 0;
}

const input = process.argv[2];

//const input = 'Ye yuh matlac xihuitl in opehualoc in atl in tepetl Mexico, in ye omoman in mitl in chimalli, in ye nohuian ontlamatcamani in ahuacan in tepehuacan';
let   atomic = input;
for(let [key,val] of Object.entries(nwt.map.general_to_atomic)){
  regex = new RegExp(key,'g');
  atomic = atomic.replace(regex,val);
}

// Now recode atomic to Hasler modern:
let hmod = atomic;
for(let [key,val] of Object.entries(nwt.map.atomic)){
  regex = new RegExp(key,'g');
  hmod = hmod.replace(regex,val.hmod);
}

// Nahuatl Abugida:
let nwa = atomic;
let mxt = nwa[0]; // The mixed intermediate
// Convert atomic vowels right away to above-base vowel signs when
// preceded by a consonant:
for(let i=1;i<nwa.length;i++){
  //console.log(nwa[i-1] + ' is consn:' + nwt.isAtomicConsonant( nwa[i-1] ) );
  //console.log(nwa[i] +   ' is vowel:' + nwt.isAtomicVowel(nwa[i]) );
  if( nwt.isAtomicVowel( nwa[i] ) && nwt.isAtomicConsonant( nwa[i-1] ) ){
    if(nwa[i]==='a'){
      // Don't push anything because the vowel a sign is intrinsic 
      // and not normally written over the abugida base consonant
    }else{
      mxt += nabMap.atomicVowelToVowelSign[nwa[i]];
    }
  }else{
    mxt += nwa[i];
  }
}
for(let [key,val] of Object.entries(nwt.map.atomic)){
  regex = new RegExp(key,'g');
  mxt = mxt.replace(regex,val.nab);
}

//console.log(nwt.isAtomicVowel('e'));
//console.log(nwt.isSomethingElse(' '));
//console.log(nwt.isAtomicConsonant('k'));
//return;

console.log(input);
console.log(atomic);
console.log(hmod);
console.log(mxt);

