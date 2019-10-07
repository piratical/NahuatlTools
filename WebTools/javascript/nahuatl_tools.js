///////////////////////////////////////
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
// INITIAL CREATION DATE: 2019.09.13 ET
//
////////////////////////////////////////

///////////////////////////////////////////
//
// CURRENT ABUGIDA CODE POINTS SECTION:
//
// Trager's Nahuatl Abugida -> nab
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
  prefixDeity:'\uEDAF',
  ///////////////////////////////////////////////////////
  //
  // END OF ABUGIDA CURRENT PUA CODE POINT ASSIGNMENTS
  //
  ///////////////////////////////////////////////////////
};

/////////////////////
//
// nab abugida maps
//
/////////////////////
nab.map={
  atomicVowelToVowelSign:{
    'a':nab.vowelSignA,
    'e':nab.vowelSignE,
    'i':nab.vowelSignI,
    'o':nab.vowelSignO,
    // FOREIGN VOWEL:
    'u':nab.vowelSignU
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
};
/////////////////////////////////////
//
// END OF nab definitions section
//
/////////////////////////////////////


////////////////////////////////////////////
//
// BEGIN nwt (nawatl) definitions section
//
////////////////////////////////////////////
const nwt={
  ///////////////////////////////////////////////////////////
  // 
  // NOTA BENE:
  // 
  // (1) We introduce an internal
  // code-use-only "computational" orthography that is
  // based on a modern Hasler orthography but where we
  // reduce the digraphs to single Unicode code points
  // with the goal of simplifying the mapping and
  // translation code. We currently use some greek letters
  // as placeholders for the digraph phonemes. 
  // We call this ATOMIC.
  //
  // (2) Mapping from ATOMIC to SEP or HASLER MODERN is trivial.
  // However, mapping to ACK and to the Trager abugida require 
  // additional processing in a more nuanced manner. Nevertheless
  // the first step is still the same: map to ATOMIC.
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
  //     As Hasler Modern seems sufficient, we don't have a writer
  //     for INTR, although we still try to handle it on the input
  //     (reading) side of things.
  //
  // (7) The general reader, toAtomic() which uses the general_to_atomic
  //     map  seems to function well. There does not seem to be a 
  //     compelling need for individual readers for SEP, ACK, etc.
  //
  ///////////////////////////////////////////////////////////
  // 
  // STT MAP SECTION
  //
  map:{
    // STT ATOMIC mapping:
    atomic:{
      // NATIVE VOWELS:
      'a':{hmod:'a',ack:'a',sep:'a',intr:'a',nab:nab.vowelA},
      'e':{hmod:'e',ack:'e',sep:'e',intr:'e',nab:nab.vowelE},
      'i':{hmod:'i',ack:'i',sep:'i',intr:'i',nab:nab.vowelI},
      'o':{hmod:'o',ack:'o',sep:'o',intr:'o',nab:nab.vowelO},
      // FOREIGN (SPANISH) VOWEL:
      'u':{hmod:'u',ack:'u',sep:'u',intr:'u',nab:nab.vowelU},
      // NATIVE CONSONANTS:
      'm':{hmod:'m',ack:'m',sep:'m',intr:'m',nab:nab.consonantMA},
      'n':{hmod:'n',ack:'n',sep:'n',intr:'n',nab:nab.consonantNA},
      'p':{hmod:'p',ack:'p',sep:'p',intr:'p',nab:nab.consonantPA},
      't':{hmod:'t',ack:'t',sep:'t',intr:'t',nab:nab.consonantTA},
      'k':{hmod:'k',ack:'c',sep:'k',intr:'k',nab:nab.consonantCA},
      'κ':{hmod:'ku',ack:'cu',sep:'ku',intr:'ku',nab:nab.consonantCUA}, // greek kappa          for [kʷ]
      'ʔ':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA},      // [ʔ]
      'τ':{hmod:'tz',ack:'tz',sep:'ts',intr:'tz',nab:nab.consonantTZA}, // greek tau            for [t͡s]
      'λ':{hmod:'tl',ack:'tl',sep:'tl',intr:'tl',nab:nab.consonantTLA}, // greek lambda         for [t͡ɬ]
      'ς':{hmod:'ch',ack:'ch',sep:'ch',intr:'ch',nab:nab.consonantCHA}, // terminal greek sigma for [t͡ʃ]
      's':{hmod:'s',ack:'s',sep:'s',intr:'s',nab:nab.consonantSA},
      'l':{hmod:'l',ack:'l',sep:'l',intr:'l',nab:nab.consonantLA},
      'x':{hmod:'x',ack:'x',sep:'x',intr:'sh',nab:nab.consonantXA},     // [ʃ]
      'h':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA},      // [h]
      'y':{hmod:'y',ack:'y',sep:'y',intr:'y',nab:nab.consonantYA},      // [j]
      'w':{hmod:'w',ack:'hu',sep:'u',intr:'w',nab:nab.consonantWA},     // [w]
      // FOREIGN (SPANISH) CONSONANTS:
      'ñ':{hmod:'ñ',ack:'ñ',sep:'ñ',intr:'ñ',nab:nab.consonantNYA},
      'β':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA},
      'd':{hmod:'d',ack:'d',sep:'d',intr:'d',nab:nab.consonantDA},
      'g':{hmod:'g',ack:'g',sep:'g',intr:'g',nab:nab.consonantGA},
      'f':{hmod:'f',ack:'f',sep:'f',intr:'f',nab:nab.consonantFA},
      'r':{hmod:'r',ack:'r',sep:'r',intr:'r',nab:nab.consonantRA}, // 'r'
      'ρ':{hmod:'rr',ack:'rr',sep:'rr',intr:'rr',nab:nab.consonantRRA} // 'rr'
    },
    // END ATOMIC SECTION

    //////////////////////////////////////////////////////
    //
    // STT GENERAL SECTION
    //
    // This is used as a general map to convert
    // "any" incoming orthography to the atomic
    //
    // k: The key in the incoming orthography. 
    //    Keys can be of any length. Longest
    //    keys first. Additional rules on key order
    //    may also apply: there may exist good reasons
    //    to process certain keys before others even when
    //    key length is not different.
    //
    // v: The value in the internal atomic orthography
    //
    //////////////////////////////////////////////////////
    general_to_atomic:[
      // SOME ARCHAIC CONVENTIONS:
      {k:'cuh',v:'κ'},   // /kʷ/ consonant in some classical variants
      {k:' yn',v:' in'}, // experimental inclusion
      {k:' yp',v:' ip'}, // experimental inclusion
      {k:' yc',v:' ic'}, // experimental inclusion
      // n BEFORE p GENERALLY NOW SPELLED WITH m
      // (ex: panpa -> pampa, cenpoalli -> cempoalli, etc.).
      {k:'np',v:'mp'}, // experimental inclusion
      // STANDARD DIGRAPHS:
      // DIGRAPHS FROM CLASSICAL ORTHOGRAPHIC VARIANTS:
      {k:'hu',v:'w'}, // [w] initial
      {k:'uh',v:'w'}, // [w] final
      {k:'qu',v:'k'},
      {k:'cu',v:'κ'}, // [kʷ] consonant initial
      {k:'uc',v:'κ'}, // [kʷ] consonant final
      {k:'tz',v:'τ'}, // /t͡s/ consonant
      {k:'ts',v:'τ'}, // /t͡s/ consonant modern orthography
      {k:'tl',v:'λ'}, // /t͡ɬ/ consonant
      {k:'ch',v:'ς'}, // /t͡ʃ/ consonant
      // DISAMBIGUATION OF [k] and [s] phonemes:
      {k:'ca',v:'ka'},
      {k:'co',v:'ko'},
      {k:'ce',v:'se'},
      {k:'ci',v:'si'},
      // DIGRAPHS IN MODERN VARIANTS:
      {k:'ku',v:'κ'}, // /kʷ/ consonant modern orthography
      {k:'kw',v:'κ'}, // /kʷ/ consonant modern variant orthography
      {k:'sh',v:'x'}, // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      {k:'rr',v:'ρ'},
      //
      // SINGLE CHARACTER SUBSTITUTIONS:
      //
      {k:'c',v:'k'},
      // ALTERNATIVE SPELLINGS:
      {k:'ç',v:'s'},
      {k:'z',v:'s'},
      // SINGLE GRAPH CONVERSIONS:
      {k:'u',v:'w'},  // SEP 
      {k:'j',v:'h'}   // SEP /h/ and glottal stop
    ],
    //////////////////////////////////////////
    //
    // deities: map of Nahuatl deity names
    // (in ATOMIC orthography)
    //
    // NOTA BENE: This list was originally based on 
    // https://en.wikipedia.org/wiki/List_of_Aztec_gods_and_supernatural_beings
    //
    //////////////////////////////////////////
    deities:{
      'awiateteo':1,'amapan':1,'aλakoya':1,'aλawa':1,'aλatoman':1,'kamaxλi':1,'senτonwiτnawa':1,'senτonmimixkoa':1,'senτontotoςtin':1,'ςalςiwλiκe':1,'ςalςiwtotolin':1,'ςalmekkasiwaλ':1,'ςantiko':1,'ςikomekoaλ':1,'ςikomexoςiλ':1,'ςimalma':1,'siwakoaλ':1,'siwateteo':1,'sinteoλ':1,'sinteoλ':1,'sinteteo':1,'sipaktonal':1,'siλalatonak':1,'siλaliκe':1,'koasiwaλ':1,'koaλiκe':1,'koaλiκe':1,'kolwaτinkaλ':1,'koyolxawki':1,'kosawkasinteoλ':1,'ehekaλ':1,'wewekoyoλ':1,'wewekoyoλ':1,'weweteoλ':1,'wiτilopoςλi':1,'wiτilopoςλi':1,'wixtosiwaλ':1,'iixposteke':1,'ilamateκthli':1,'iτkake':1,'iτpapaloλ':1,'iτpapaloλ':1,'iτpapaloλsiwaλ':1,'iτpapaloλtotek':1,'iτλakoliwki':1,'iτλi':1,'ixkimilli':1,'ixkitekaλ':1,'ixλilton':1,'istaκkasinteoλ':1,'maκilkoskaκawλi':1,'maκilκeτpalin':1,'maκilmalinalli':1,'maκiltoςλi':1,'maκiltoςλi':1,'maκiltotek':1,'maκilxoςiλ':1,'malinalxoςiλ':1,'mayawel':1,'meτλi':1,'mikapeλakalli':1,'miktekasiwaλ':1,'mikλanteκλi':1,'mixkoaλ':1,'mixkoaλ':1,'nanawaτin':1,'nappateκλi':1,'nesoxoςi':1,'nextepewa':1,'omakaλ':1,'omesiwaλ':1,'ometeκλi':1,'ometeoλ':1,'ometoςλi':1,'opoςλi':1,'oxomo':1,'painal':1,'patekaλ':1,'pilτinteκλi':1,'kawsiwaλ':1,'keτalkoaλ':1,'kilasli':1,'teksistekaλ':1,'teςloλ':1,'temaskaltesi':1,'tepeyolloλ':1,'tepostekaλ':1,'texkaτonaλ':1,'teskaλipoka':1,'teskaτonkaλ':1,'λakawepan':1,'λakoτonλi':1,'λawiskalpanteκλi':1,'λalsiwaλ':1,'λalok':1,'λalok':1,'λaloke':1,'λaltekayoa':1,'λalteκλi':1,'λaλawkasinteoλ':1,'λasolteoλ':1,'λasolteoλ':1,'λilwa':1,'tosi':1,'toltekaλ':1,'tonakasiwaλ':1,'tonakateκλi':1,'tonatiw':1,'tonatiw.':1,'τiτimimeh':1,'τiτiminsiwaλ':1,'τiτimiλ':1,'τontemok':1,'xilonen':1,'xipetotek':1,'xipetotek':1,'xipetotek':1,'xippilli':1,'xiwkosawki':1,'xiwistaκki':1,'xiwteκλi':1,'xiwteκλi':1,'xiwλaλawki':1,'xiwtotonλi':1,'xiwxoxoawki':1,'xoςipilli':1,'xoςikeτal':1,'xoςiλiκe':1,'xoςiλiκe':1,'xoloλ':1,'xoloλ':1,'yakateκλi':1,'yakateκλi':1,'yaosiwaλ':1,'yayawkasinteoλ':1,'sakaτonλi':1,'sakaτonλi':1
    }
    // END OF deities list
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
  },
  /////////////////////////////////////////////////////
  //
  // toAtomic: converts input in any format to Atomic
  //
  /////////////////////////////////////////////////////
  toAtomic:function(input){
    if(!input) return '';
    let atomic=input;
    for(let entry of nwt.map.general_to_atomic){
      regex = new RegExp(entry.k,'g');
      atomic = atomic.replace(regex,entry.v);
    }
    return atomic;
  },
  /////////////////////////////////////////
  //
  // atomicToSEP:
  //
  /////////////////////////////////////////
  atomicToSEP:function(atomic){
    let sep = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        sep += nwt.map.atomic[current].sep;
      }else{
        sep += current;
      }
    }
    return sep;
  },
  /////////////////////////////////////////
  //
  // atomicToHaslerModern:
  //
  /////////////////////////////////////////
  atomicToHaslerModern:function(atomic){
    let hmod = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        hmod += nwt.map.atomic[current].hmod;
      }else{
        hmod += current;
      }
    }
    return hmod;
  },
  /////////////////////////////////////////
  //
  // atomicToACK: Convert Atomic to ACK:
  //
  /////////////////////////////////////////
  atomicToACK:function(atomic){
    let result='';
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
        result += current==='w' ? 'uh' : 'uc' ;
      }else if( (current==='k' || current==='s') && nwt.isAtomicVowel(next) ){
        if(next==='e' || next==='i'){
          // vowels e and i:
          // k maps to: que , qui
          // s maps to: ce  , ci
          result += current==='k' ? 'qu' : 'c'; 
        }else{
          // vowels a and o:
          // k maps to: ca , co
          // s maps to: za , zo
          result += current==='k' ? 'c' : 'z'; 
        }
      }else if(nwt.isAtomicLetter(current)){
        result += nwt.map.atomic[current].ack;
      }else{
        result += current;
      }
    }
    return result;
  },
  ////////////////////////////////////////////
  //
  // atomicToTragerModern
  //
  ////////////////////////////////////////////
  atomicToTragerModern:function(atomic){
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
          result += nab.map.atomicVowelToVowelSign[current];
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
        const compoundSign = nab.map.atomicVowelPairsToCompoundVowelSign[previous+current];
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
    return result;
  },
  // END atomicToTragerModern

  ////////////////////////////////////////////////////////////
  //
  // hasLocativeSuffix
  //
  // NOTA BENE: This works on a word in ATOMIC orthography
  //
  ////////////////////////////////////////////////////////////
  hasLocativeSuffix(s){
    return s.match(/(ko|λan|tepek|τinco|singo|apa|apan)$/);
  },
  ////////////////////////////////////////////////////////////
  //
  // isDeity: true if the name is in the list of deities
  //
  // NOTA BENE: This works on a name in ATOMIC orthography
  //
  ////////////////////////////////////////////////////////////
  isDeity:function(name){
    return nwt.map.deities[name];
  },
  /////////////////////////////////////////
  //
  // splitToMetaWords
  //
  /////////////////////////////////////////
  splitToMetaWords:function(input){
    const words = input.split(/ +/);
    const metaWords=[];
    for(let word of words){
      const mw = {}; // meta-word object
      mw.original       = word;
      mw.atomic         = nwt.toAtomic( word.toLowerCase() );
      const firstLetter = word[0];
      mw.flic           = firstLetter===firstLetter.toUpperCase(); // flic
      mw.isPlace        = nwt.hasLocativeSuffix( mw.atomic );
      mw.isDeity        = nwt.isDeity( mw.atomic );
      metaWords.push( mw );
    }
    return metaWords; 
  },
  /////////////////////////////////////////
  //
  // capitalize:
  //
  /////////////////////////////////////////
  capitalize:function(s){
    return s[0].toUpperCase() + s.slice(1);
  }
};


//////////////////////////
//
// MAIN
//
//////////////////////////
if(process.argv.length<3){
  console.log('No string to process');
  return 0;
}

const input = process.argv[2];
const atomic = nwt.toAtomic(input);

//console.log('XXXXXXXXXXXXXXXXXXXXXXXXX');
//console.log(atomic);
//console.log('XXXXXXXXXXXXXXXXXXXXXXXXX');
//return;

//////////////////////////////
//
// Convert Atomic to ACK, SEP:
//
//////////////////////////////

//const sep  = nwt.atomicToSEP(atomic);
//const hmod = nwt.atomicToHaslerModern(atomic);
//const ack  = nwt.atomicToACK(atomic);
//const tmod = nwt.atomicToTragerModern(atomic);

//console.log(input);
//console.log('↓ CONVERTED TO INTERNAL ATOMIC ORTHOGRAPHY ↓');
//console.log(atomic);
//console.log('↓ CONVERTED TO HASLER MODERN ↓');
//console.log(hmod);
//console.log('↓ CONVERTED TO SEP ↓');
//console.log(sep);
//console.log('↓ CONVERTED TO TRAGER ABUGIDA ↓');
//console.log(tmod);
//console.log('↓ CONVERTED TO ACK ↓');
//console.log(ack);


//
// More complicated pipeline:
//
console.log('===== Pipeline that handles capitalization properly =====');
console.log(input);
const metaWords = nwt.splitToMetaWords(input);

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
    // Hasler Modern with NO conversion of capitalized names:
    hmod += metaWord.original;
    // SEP with conversion of ALL capitalized words:
    sep  += nwt.capitalize( ssep  );
    // ACK with NO conversion of capitalized names:
    ack  += metaWord.original;
    ///////////////////////////////////////////////////////////////////////////
    //
    // TRAGER with conversion of place names but NO conversion of other names:
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
    }else{
      // Some other name, don't convert:
      tmod += metaWord.original;
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
console.log(hmod);
console.log(sep );
console.log(ack );
console.log(tmod);

// END OF CODE 

