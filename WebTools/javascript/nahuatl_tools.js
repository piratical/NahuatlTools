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
  },
  atomicVowelPairsToCompoundVowelSign:{
    'ia':nab.vowelSignIA,
    'ai':nab.vowelSignAI,
    'oa':nab.vowelSignOA,
    'eo':nab.vowelSignEO,
    'ei':nab.vowelSignEI,
    'io':nab.vowelSignIO,
    'ao':nab.vowelSignAO
  }
}

//
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
      // SOME ARCHAIC CONVENTIONS:
      ' yn':' in', // experimental inclusion
      ' yp':' ip', // experimental inclusion
      ' yc':' ic', // experimental inclusion
      'cuh':'κ', // /kʷ/ consonant
      // n BEFORE p GENERALLY NOW SPELLED WITH m
      // (ex: pampa, cempoalli, etc.):
      'np':'mp', // experimental inclusion
      // STANDARD DIGRAPHS:
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
      'sh':'x', // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      'rr':'ρ',
      // SINGLE CHARACTERS:
      'c':'k',
      // ALTERNATIVE SPELLINGS:
      'ç':'s',
      'z':'s',
      // SINGLE GRAPH CONVERSIONS:
      'u':'w',  // 
      'j':'h'   // /h/ and glottal stop
    }

  },
  // END MAP SECTION

  //////////////////////////
  //
  // isAtomicLetter
  //
  //////////////////////////
  isAtomicLetter:function(c){
    return 'aeioumnptkκτλςsxhlwyñβdgfrρ'.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicVowel
  //
  //////////////////////////
  isAtomicVowel:function(c){
    return 'aeiou'.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicConsonant
  //
  //////////////////////////
  isAtomicConsonant:function(c){
    return 'mnptkκτλςsxhlwyñβdgfrρ'.indexOf(c) != -1;
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

// Now recode atomic to SEP:
let sep = '';
for(let i=0;i<atomic.length;i++){
  const current = atomic[i];
  if(nwt.isAtomicLetter(current)){
    sep += nwt.map.atomic[current].sep;
  }else{
    sep += current;
  }
}

//for(let [key,val] of Object.entries(nwt.map.atomic)){
//  regex = new RegExp(key,'g');
//  sep = sep.replace(regex,val.sep);
//}

// CONVERT ATOMIC TO ABUGIDA:

// Convert atomic vowels right away to above-base vowel signs when
// preceded by a consonant:
let result='';
for(let i=0;i<atomic.length;i++){
  
  const current  = atomic[ i ];
  const previous = i>0               ? atomic[i-1] : ' ' ;
  const next     = i<atomic.length-1 ? atomic[i+1] : ' ' ;
  
  if(nwt.isAtomicVowel(current) && nwt.isAtomicConsonant(previous)){
    // Convert atomic vowels following consonants immediately 
    // to above-base vowel signs:
    if(current==='a'){
      // Don't push anything because the vowel /a/ sign is intrinsic 
      // and not normally written over the abugida base consonant
    }else{
      result += nabMap.atomicVowelToVowelSign[current];
    }
  }else if(nwt.isAtomicConsonant(current) && nwt.isAtomicVowel(previous) && !nwt.isAtomicVowel(next)){
    // If the previous letter is a vowel and this is a consonant, then we have to think about making
    // consonant a subjoined consonant. However, if the *next* letter is a vowel, then this consonant
    // is actually the base for the next syllabic cluster. But if the *next* letter is *not* a vowel,
    // then indeed this consonant is a final consonant on the current syllabic cluster. So we have:
    result += nab.subjoinerSign;             // Push subjoiner
    result += nwt.map.atomic[current].nab;   // Push consonant
  }else if(nwt.isAtomicVowel(current) && nwt.isAtomicVowel(previous)){
    // Opportunity for combined vowel sign:
    const compoundSign = nabMap.atomicVowelPairsToCompoundVowelSign[previous+current];
    if(compoundSign){
      // The vowel combination has a special combined symbol, so replace
      // the current singleton vowel sign with the compound vowel sign.
      //
      // However, in the case of a previous 'a', then there is no visible sign
      // so in that case, just add the combined symbol at the end, as there is
      // nothing to replace:
      if(previous==='a'){
        result += compoundSign;
      }else{
        result = result.slice(0, -1) + compoundSign;
      }
    }else{
    // Otherwise do nothing if no special combined vowel sign exists ...
      result += nwt.map.atomic[current].nab;
    }
  }else if(nwt.isAtomicLetter(current)){
    result += nwt.map.atomic[current].nab;
  }else{
    result += current;
  }
}

//////////////////////////////
//
// Convert Atomic to ACK:
//
//////////////////////////////
let result2='';
for(let i=0;i<atomic.length;i++){
  
  const current  = atomic[ i ];
  const previous = i>0               ? atomic[i-1] : ' ' ;
  const next     = i<atomic.length-1 ? atomic[i+1] : ' ' ;

  // If the current consonant is a syllable-
  // terminating /w/ or /kʷ/ , then use 
  // 'uh' in place of 'hu' or 'uc' in place 
  // of 'cu', respectively:
  if( (current==='w' || current==='κ') && nwt.isAtomicVowel(previous) && !nwt.isAtomicVowel(next) ){
    // w maps to 'uh'
    // κ maps to 'uc'
    result2 += current==='w' ? 'uh' : 'uc' ;
  }else if( (current==='k' || current==='s') && nwt.isAtomicVowel(next) ){
    if(next==='e' || next==='i'){
      // vowels e and i:
      // k maps to: que , qui
      // s maps to: ce  , ci
      result2 += current==='k' ? 'qu' : 'c'; 
    }else{
      // vowels a and o:
      // k maps to: ca , co
      // s maps to: za , zo
      result2 += current==='k' ? 'c' : 'z'; 
    }
  }else if(nwt.isAtomicLetter(current)){
    result2 += nwt.map.atomic[current].ack;
  }else{
    result2 += current;
  }
}

console.log(input);
console.log('↓ CONVERTED TO INTERNAL ATOMIC ORTHOGRAPHY ↓');
console.log(atomic);
console.log('↓ CONVERTED TO HASLER MODERN ↓');
console.log(hmod);
console.log('↓ CONVERTED TO SEP ↓');
console.log(sep);
console.log('↓ CONVERTED TO TRAGER ABUGIDA ↓');
console.log(result);
console.log('↓ CONVERTED TO ACK ↓');
console.log(result2);

