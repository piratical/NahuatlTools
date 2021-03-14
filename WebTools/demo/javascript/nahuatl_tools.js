///////////////////////////////////////
//
// nahuatl_tools.js
//
// (c) 2019, 2020 by Edward H. Trager
//     ALL RIGHTS RESERVED
//
// (c) 2019, 2020 por Edward H. TRAGER
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
// LAST NOTED UPDATE: 2019.12.05.ET
// (SOME UPDATES MAY NOT BE 'NOTED':
// CHECK GITHUB HISTORY FOR THE AUTHORATIVE
// CHANGE LOG).
//
////////////////////////////////////////

// REQUIRES:
const nms = require('./names.js').nms;

////////////////////////////////////////////////////////////////////
//
// INTRODUCTION
//
// Here we introduce an internal code-use-only 
// "computational orthography" that is
// based on a modern Hasler orthography but where we
// reduce digraphs to single Unicode code points
// with the goal of simplifying the mapping and
// translation code. We currently use a few greek letters
// as 'placeholders' for Náhuatl phonemes which must be 
// written as digraphs in Latin-based orthographies. We call this 
// ATOMIC. The TRAGER orthography, which is included here, is the only 
// "non-computational orthography" that has unique letter symols for 
// all consonantal phonemes, thus eliminating the need for (and unwanted 
// complexity of) digraphs.
//
// With this ATOMIC orthography in place, the general idea is that we
// should be able —within reasonable bounds— to "map" almost *any*
// colonial-era or modern written representation of Nahuatl language
// into the ATOMIC orthography. From the ATOMIC representation,
// we can then run the mapping process the other way to produce output
// in any desired orthographic format. In practice, we limit the
// output formats to well-known orthographies: Hasler modern, ACK, SEP,
// —and of course also to the TRAGER orthography.
//
// Here is a summary diagram of this process:
//
//             COLONIAL-ERA           HASLER     INTERNET
//               NAHUATL       SEP    MODERN     INTUITIVE    ACK
//                 |            |       |            |         |
//                 +------------+-------+------------+---------+
//                                      |
//                                      V
//                                    ATOMIC
//                                      |
//                                      V
//                                      |
//                     +-------+--------+-------+--- ... -----+
//                     |       |        |       |             |
//                     V       V        V       V             V
//                   HASLER   ACK     TRAGER   SEP          (ETC.)
//
//
// It sounds simple, right? But of course the "devil is in the 
// details." For example, the code now includes a lookup-table of
// common names of people, so that we can intentionally avoid
// "converting" the spelling of people's names. Also, there is
// a lookup-table for the names of Aztec gods and dieties. And there
// is a heuristic function for place names. With these, we can
// look for capitalized words in a text and at least somewhat 
// heuristically decide what to do with them. For example, the TRAGER
// orthography does not have upper-case vs. lower-case 
// letters, but it does have a special set of prefix characters for
// marking names of people, names of deities, and place names. So
// the code here will mark off such names, although naturally it 
// can only do so within the mechanical limitations of the lookup
// tables and heuristics. Nevertheless, this feature saves time and
// reduces the amount of manual editing required. For the other
// orthographies, the main thing is to preserve capitalization and
// avoid unecessary conversions on the spellings of proper names.
//
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//
// STT OF ato definitions section
//
// ==> Classification of letters used
//     for the internal ATOMIC
//     orthography.
//
// ==> Anything not present here
//     should, as a general principle,
//     pass through without change.
//
// ==> Note that now 'b' and 'v' are included
//     as discrete items in the atomic set
//     so that we can preserve the spelling distinctions
//     between them for orthographies like Hasler and SEP
//     but we can still group them together (into the 'β')
//     for the TRAGER orthography (The phoneme-based TRAGER
//     orthography does not differentiate Spanish 'b' from 'v').
//
///////////////////////////////////////////////////////////////
const ato={
  vowels:{
    native:'aeioāēīō', // NB: Vowels with macrons are in Unicode precomposed form NFC
    foreign:'uū'
  },
  consonants:{
    native:'mnptkκτλςsxhlwy',
    foreign:'ñβdgfrρbv'  // NOTA BENE: ADDITION OF 'bv' AT END HERE
  }
};
//
// Convenience groupings:
//
ato.vowels.all     = ato.vowels.native     + ato.vowels.foreign;
ato.consonants.all = ato.consonants.native + ato.consonants.foreign;
ato.all            = ato.vowels.all + ato.consonants.all;
/////////////////////////////////////
//
// END OF ato definitions section
//
/////////////////////////////////////


///////////////////////////////////////////
//
// CURRENT ABUGIDA CODE POINTS SECTION:
//
// Trager's Nahuatl Abugida -> nab
//
///////////////////////////////////////////
const nab={
  ////////////////////////////////////////////////////////////////////
  //
  // CURRENT ABUGIDA CODE ASSIGNMENTS FOR THE TRAGER ORTHOGRAPHY
  //
  // CURRENTLY THESE ARE PRIVATE USE AREA
  // (PUA) ASSIGNMENTS USED IN THE NahuatlOne font.
  //
  // (Assignments taken from Trager's Nahuatl Tools C++ Transcoder)
  //
  ////////////////////////////////////////////////////////////////////
  // Vowels:
  vowelA:'\uED90',
  vowelE:'\uED91',
  vowelI:'\uED92',
  vowelO:'\uED93',
  vowelU:'\uED94',        // FOREIGN VOWEL
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
    'u':nab.vowelSignU,
    // LONG VOWELS: āēīōū
    'ā':nab.vowelSignA + nab.longVowelSign,
    'ē':nab.vowelSignE + nab.longVowelSign,
    'ī':nab.vowelSignI + nab.longVowelSign,
    'ō':nab.vowelSignO + nab.longVowelSign,
    'ū':nab.vowelSignU + nab.longVowelSign
  },
  atomicVowelPairsToCompoundVowelSign:{
    'ia':nab.vowelSignIA,
    'ai':nab.vowelSignAI,
    'oa':nab.vowelSignOA,
    'eo':nab.vowelSignEO,
    'ei':nab.vowelSignEI,
    'io':nab.vowelSignIO,
    'ao':nab.vowelSignAO,
  } 
};
/////////////////////////////////////
//
// END OF nab definitions section
//
/////////////////////////////////////

//////////////////////////////////////
//
// ALLOPHONE RULES SECTION: alo
//
// NOTA BENE: BE SURE TO USE ATOMIC
// ORTHOGRAPHY FOR ANY RULES
//
//////////////////////////////////////
const alo={
  // /n/ to [h]:
  n2h:{
    // These are the words that
    // preserve terminal /n/ as [n]:
    exclude:{
      'wan':1,
      'ken':1,
      'pan':1,
      'ipan':1,
      'λen':1,
      'λan':1
    }
  },
  w2h:{
  },
  kw2k:{
  }
};


////////////////////////////////////////////
//
// BEGIN nwt (nawatl) definitions section
//
////////////////////////////////////////////
const nwt={
  /////////////////////////////////////////////////////////////////////////////
  // 
  // NOTA BENE:
  // 
  // (1) Here we employ the internal
  // code-use-only "computational" ATOMIC orthography
  // described in detail in the INTRODUCTION.
  //
  // (2) Mapping from ATOMIC to SEP or HASLER MODERN is trivial.
  // However, mapping to ACK and to the TRAGER abugida require 
  // additional processing in a more nuanced manner. Nevertheless
  // the first step is still the same: map to ATOMIC.
  // 
  // (3) HMOD is our version of Hasler Modern 
  // using 'w' for [w] and 'h' for [ʔ]/[h]
  // 
  // (4) ACK  is Andrews-Campbell-Kartunnen 
  // "ACK" appears to have been coined by Sullivan & Olko
  //
  // (5) SEP is SEP using 'u' for [w] and 'j' for [ʔ]/[h]
  //
  // (6) INTR: (internet/intuitive) is like #3 but using sh for [ʃ]
  //     As Hasler Modern seems sufficient, we don't have a writer
  //     for INTR, although we still try to handle it on the input
  //     (reading) side of things.
  //
  // (7) The general reader, toAtomic() which uses the general_to_atomic
  //     map  seems to function well. There does not seem to be a 
  //     compelling need for individual readers for SEP, ACK, etc.
  //     One could always add additional specific readers to handle 
  //     some other orthography that the general reader cannot handle.
  //
  /////////////////////////////////////////////////////////////////////////////
  // 
  // STT MAP SECTION
  //
  map:{
    // STT ATOMIC mapping:
    atomic:{
      // NATIVE VOWELS:
      'a':{hmod:'a',ack:'a',sep:'a',intr:'a',nab:nab.vowelA,ipa:'a'},
      'e':{hmod:'e',ack:'e',sep:'e',intr:'e',nab:nab.vowelE,ipa:'e'},
      'i':{hmod:'i',ack:'i',sep:'i',intr:'i',nab:nab.vowelI,ipa:'i'},
      'o':{hmod:'o',ack:'o',sep:'o',intr:'o',nab:nab.vowelO,ipa:'o'},
      // FOREIGN (SPANISH) VOWEL:
      'u':{hmod:'u',ack:'u',sep:'u',intr:'u',nab:nab.vowelU,ipa:'u'},
      // LONG VOWEL MAPPING: āēīōū
      'ā':{hmod:'ā',ack:'ā',sep:'ā',intr:'ā',nab:nab.vowelA + nab.longVowelSign,ipa:'aː'},
      'ē':{hmod:'ē',ack:'ē',sep:'ē',intr:'ē',nab:nab.vowelE + nab.longVowelSign,ipa:'eː'},
      'ī':{hmod:'ī',ack:'ī',sep:'ī',intr:'ī',nab:nab.vowelI + nab.longVowelSign,ipa:'iː'},
      'ō':{hmod:'ō',ack:'ō',sep:'ō',intr:'ō',nab:nab.vowelO + nab.longVowelSign,ipa:'oː'},
      'ū':{hmod:'ū',ack:'ū',sep:'ū',intr:'ū',nab:nab.vowelU + nab.longVowelSign,ipa:'uː'},
      // NATIVE CONSONANTS:
      'm':{hmod:'m',ack:'m',sep:'m',intr:'m',nab:nab.consonantMA,ipa:'m'},
      'n':{hmod:'n',ack:'n',sep:'n',intr:'n',nab:nab.consonantNA,ipa:'n'},
      'p':{hmod:'p',ack:'p',sep:'p',intr:'p',nab:nab.consonantPA,ipa:'p'},
      't':{hmod:'t',ack:'t',sep:'t',intr:'t',nab:nab.consonantTA,ipa:'t'},
      'k':{hmod:'k',ack:'c',sep:'k',intr:'k',nab:nab.consonantCA,ipa:'k'},
      'κ':{hmod:'ku',ack:'cu',sep:'ku',intr:'ku',nab:nab.consonantCUA,ipa:'kʷ'}, // greek kappa          for [kʷ]
      'ʔ':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA,ipa:'ʔ'},      // [ʔ]
      'τ':{hmod:'tz',ack:'tz',sep:'ts',intr:'tz',nab:nab.consonantTZA,ipa:'t͡s'}, // greek tau            for [t͡s]
      'λ':{hmod:'tl',ack:'tl',sep:'tl',intr:'tl',nab:nab.consonantTLA,ipa:'t͡ɬ'}, // greek lambda         for [t͡ɬ]
      'ς':{hmod:'ch',ack:'ch',sep:'ch',intr:'ch',nab:nab.consonantCHA,ipa:'t͡ʃ'}, // terminal greek sigma for [t͡ʃ]
      's':{hmod:'s',ack:'z',sep:'s',intr:'s',nab:nab.consonantSA,ipa:'s'},
      'l':{hmod:'l',ack:'l',sep:'l',intr:'l',nab:nab.consonantLA,ipa:'l'},
      'x':{hmod:'x',ack:'x',sep:'x',intr:'sh',nab:nab.consonantXA,ipa:'ʃ'},     // [ʃ]
      'h':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA,ipa:'h'},      // [h]
      'y':{hmod:'y',ack:'y',sep:'y',intr:'y',nab:nab.consonantYA,ipa:'j'},      // [j]
      'w':{hmod:'w',ack:'hu',sep:'u',intr:'w',nab:nab.consonantWA,ipa:'w'},     // [w]
      // FOREIGN (SPANISH) CONSONANTS:
      'ñ':{hmod:'ñ',ack:'ñ',sep:'ñ',intr:'ñ',nab:nab.consonantNYA,ipa:'ɲ'},
      'β':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA,ipa:'β'},
      'b':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA,ipa:'b'}, // NOTA BENE!
      'v':{hmod:'v',ack:'v',sep:'v',intr:'v',nab:nab.consonantBVA,ipa:'v'}, // NOTA BENE!
      'd':{hmod:'d',ack:'d',sep:'d',intr:'d',nab:nab.consonantDA,ipa:'d'},
      'g':{hmod:'g',ack:'g',sep:'g',intr:'g',nab:nab.consonantGA,ipa:'g'},
      'f':{hmod:'f',ack:'f',sep:'f',intr:'f',nab:nab.consonantFA,ipa:'f'},
      'r':{hmod:'r',ack:'r',sep:'r',intr:'r',nab:nab.consonantRA,ipa:'ɾ'}, // 'r'
      'ρ':{hmod:'rr',ack:'rr',sep:'rr',intr:'rr',nab:nab.consonantRRA,ipa:'r'} // 'rr'
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
    //    Keys can be of any length. LONGEST
    //    KEYS FIRST. Additional rules on key order
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
      // 2019.12.05.ET addenda: Possibly rare case in colonial era documents 
      // of a "v" representing /w/ e.g., "çivatl" for "cihuatl". 
      // Presumably this variant spelling only occurs
      // when "v" is nested between vowels. There are 4 vowels, so 4x4=16 cases:
      {k:'ava',v:'awa'},
      {k:'ave',v:'awe'},
      {k:'avi',v:'awi'},
      {k:'avo',v:'awo'},
      {k:'eva',v:'ewa'},
      {k:'eve',v:'ewe'},
      {k:'evi',v:'ewi'},
      {k:'evo',v:'ewo'},
      {k:'iva',v:'iwa'},
      {k:'ive',v:'iwe'},
      {k:'ivi',v:'iwi'},
      {k:'ivo',v:'iwo'},
      {k:'ova',v:'owa'},
      {k:'ove',v:'owe'},
      {k:'ovi',v:'owi'},
      {k:'ovo',v:'owo'},
      // 2019.12.05.ET addenda: Anytime a "y" is followed by a consonant,
      // treat the "y" as vowel /i/, e.g. ymach=>imach, ytoca=>itoca, yn=>in, yhuan=>ihuan, etc.
      // This thus covers one of the common colonial variant practices:
      {k:'ym',v:'im'}, //
      {k:'yn',v:'in'}, //
      {k:'yp',v:'ip'}, //
      {k:'yt',v:'it'}, //
      {k:'yc',v:'ic'}, // covers colonial era /ik/ and /ikʷ/ and /it͡ʃ/
      {k:'yq',v:'iq'}, // covers colonial era /iki/ and /ike/
      {k:'yh',v:'ih'}, // covers colonial era /ih/ and /iw/
      {k:'yt',v:'it'}, // covers colonial era /it/, /it͡s/ and /it͡ɬ/
      {k:'ys',v:'is'}, //
      {k:'yl',v:'il'}, //
      {k:'yx',v:'ix'}, //
      {k:'yw',v:'iw'}, // hmmm ... no idea if this one really occurs
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
      {k:'cā',v:'kā'},
      {k:'cō',v:'kō'},
      {k:'cē',v:'sē'},
      {k:'cī',v:'sī'},
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
      'awiateteo':1,'amapan':1,'aλakoya':1,'aλawa':1,'aλatoman':1,'kamaxλi':1,'senτonwiτnawa':1,'senτonmimixkoa':1,'senτontotoςtin':1,'ςalςiwλiκe':1,'ςalςiwtotolin':1,'ςalmekkasiwaλ':1,'ςantiko':1,'ςikomekoaλ':1,'ςikomexoςiλ':1,'ςimalma':1,'siwakoaλ':1,'siwateteo':1,'sinteoλ':1,'sinteoλ':1,'sinteteo':1,'sipaktonal':1,'siλalatonak':1,'siλaliκe':1,'koasiwaλ':1,'koaλiκe':1,'koaλiκe':1,'kolwaτinkaλ':1,'koyolxawki':1,'kosawkasinteoλ':1,'ehekaλ':1,'wewekoyoλ':1,'wewekoyoλ':1,'weweteoλ':1,'wiτilopoςλi':1,'wiτilopoςλi':1,'wixtosiwaλ':1,'iixposteke':1,'ilamateκthli':1,'iτkake':1,'iτpapaloλ':1,'iτpapaloλ':1,'iτpapaloλsiwaλ':1,'iτpapaloλtotek':1,'iτλakoliwki':1,'iτλi':1,'ixkimilli':1,'ixkitekaλ':1,'ixλilton':1,'istaκkasinteoλ':1,'maκilkoskaκawλi':1,'maκilκeτpalin':1,'maκilmalinalli':1,'maκiltoςλi':1,'maκiltoςλi':1,'maκiltotek':1,'maκilxoςiλ':1,'malinalxoςiλ':1,'mayawel':1,'meτλi':1,'mikapeλakalli':1,'miktekasiwaλ':1,'mikλanteκλi':1,'mixkoaλ':1,'mixkoaλ':1,'nanawaτin':1,'nappateκλi':1,'nesoxoςi':1,'nextepewa':1,'omakaλ':1,'omesiwaλ':1,'ometeκλi':1,'ometeoλ':1,'ometoςλi':1,'opoςλi':1,'oxomo':1,'painal':1,'patekaλ':1,'pilτinteκλi':1,'kawsiwaλ':1,'keτalkoaλ':1,'kilasli':1,'teksistekaλ':1,'teςloλ':1,'temaskaltesi':1,'tepeyolloλ':1,'tepostekaλ':1,'texkaτonaλ':1,'teskaλipoka':1,'teskaτonkaλ':1,'λakawepan':1,'λakoτonλi':1,'λawiskalpanteκλi':1,'λalsiwaλ':1,'λalok':1,'λalok':1,'λaloke':1,'λaltekayoa':1,'λalteκλi':1,'λaλawkasinteoλ':1,'λasolteoλ':1,'λasolteoλ':1,'λilwa':1,'tosi':1,'toltekaλ':1,'tonakasiwaλ':1,'tonakateκλi':1,'tonatiw':1,'tonatiw.':1,'τiτimimeh':1,'τiτiminsiwaλ':1,'τiτimiλ':1,'τontemok':1,'xilonen':1,'xipetotek':1,'xipetotek':1,'xipetotek':1,'xippilli':1,'xiwkosawki':1,'xiwistaκki':1,'xiwteκλi':1,'xiwteκλi':1,'xiwλaλawki':1,'xiwtotonλi':1,'xiwxoxoawki':1,'xoςipilli':1,'xoςikeτal':1,'xoςiλiκe':1,'xoςiλiκe':1,'xoloλ':1,'xoloλ':1,'yakateκλi':1,'yakateκλi':1,'yaosiwaλ':1,'yayawkasinteoλ':1,'sakaτonλi':1,'sakaτonλi':1,'dios':1
    },
    //////////////////////////////////////////////////////////////////////////
    //
    // 500 Nombres más populares en México en la segunda mitad del siglo XX
    // Fuente: Registro de Personal Federalizado de la SEP, 2012
    // Fecha de elaboración: Feb 2015
    // Versión: 2
    // Source: http://datamx.io/dataset/nombres-mas-comunes-en-mexico
    // (with a few additions)
    //
    //////////////////////////////////////////////////////////////////////////
    people:{
      'aaron':{g:'m',n:70},'abel':{g:'m',n:114},'abelardo':{g:'m',n:35},'abigail':{g:'f',n:72},'abraham':{g:'m',n:103},'adalberto':{g:'m',n:41},'adan':{g:'m',n:71},'adela':{g:'f',n:110},'adolfo':{g:'m',n:109},'adrian':{g:'m',n:192},'adriana':{g:'f',n:624},'agustin':{g:'m',n:183},'agustina':{g:'f',n:51},'aida':{g:'f',n:138},'aide':{g:'f',n:65},'alan':{g:'m',n:31},'alba':{g:'f',n:92},'alberto':{g:'m',n:930},'aldo':{g:'m',n:38},'alejandra':{g:'f',n:592},'alejandrina':{g:'f',n:51},'alejandro':{g:'m',n:693},'alfonso':{g:'m',n:271},'alfredo':{g:'m',n:413},'alicia':{g:'f',n:761},'alma':{g:'f',n:582},'alonso':{g:'m',n:117},'alvaro':{g:'m',n:113},'amado':{g:'m',n:43},'amalia':{g:'f',n:84},'amelia':{g:'f',n:72},'america':{g:'f',n:67},'amparo':{g:'f',n:94},'ana':{g:'f',n:1235},'anabel':{g:'f',n:92},'andrea':{g:'f',n:108},'andres':{g:'m',n:196},'anel':{g:'f',n:52},'angel':{g:'m',n:870},'angela':{g:'f',n:120},'angeles':{g:'f',n:101},'angelica':{g:'f',n:713},'angelina':{g:'f',n:75},'anselmo':{g:'m',n:29},'antonia':{g:'f',n:248},'antonieta':{g:'f',n:78},'antonio':{g:'m',n:1226},'apolinar':{g:'m',n:32},'araceli':{g:'f',n:498},'aracely':{g:'f',n:74},'areli':{g:'f',n:71},'arely':{g:'f',n:57},'ariel':{g:'m',n:46},'aristeo':{g:'m',n:24},'armando':{g:'m',n:442},'arnoldo':{g:'m',n:23},'arnulfo':{g:'m',n:47},'artemio':{g:'m',n:43},'arturo':{g:'m',n:546},'asuncion':{g:'f',n:64},'augusto':{g:'m',n:56},'aurelia':{g:'f',n:52},'aureliano':{g:'m',n:25},'aurelio':{g:'m',n:79},'aurora':{g:'f',n:219},'azucena':{g:'f',n:118},'baltazar':{g:'m',n:30},'beatriz':{g:'f',n:566},'benito':{g:'m',n:77},'benjamin':{g:'m',n:122},'berenice':{g:'f',n:243},'bernabe':{g:'m',n:29},'bernardino':{g:'m',n:23},'bernardo':{g:'m',n:83},'bertha':{g:'f',n:274},'blanca':{g:'f',n:524},'brenda':{g:'f',n:174},'candelaria':{g:'f',n:84},'candelario':{g:'m',n:27},'candido':{g:'m',n:29},'carlos':{g:'m',n:1178},'carmen':{g:'f',n:452},'carmen':{g:'m',n:36},'carolina':{g:'f',n:264},'catalina':{g:'f',n:213},'cecilia':{g:'f',n:341},'cecilio':{g:'m',n:28},'celia':{g:'f',n:162},'cesar':{g:'m',n:544},'christian':{g:'m',n:50},'cirilo':{g:'m',n:31},'clara':{g:'f',n:141},'claudia':{g:'f',n:707},'claudio':{g:'m',n:33},'clemente':{g:'m',n:35},'concepcion':{g:'f',n:423},'concepcion':{g:'m',n:24},'constantino':{g:'m',n:29},'consuelo':{g:'f',n:95},'cristian':{g:'m',n:32},'cristina':{g:'f',n:398},'cristobal':{g:'m',n:39},'cruz':{g:'f',n:128},'cruz':{g:'m',n:84},'cuauhtemoc':{g:'m',n:48},'cynthia':{g:'f',n:70},'dagoberto':{g:'m',n:23},'dalia':{g:'f',n:78},'damian':{g:'m',n:30},'daniel':{g:'m',n:372},'daniela':{g:'f',n:69},'dario':{g:'m',n:46},'david':{g:'m',n:376},'delfino':{g:'m',n:46},'delia':{g:'f',n:265},'demetrio':{g:'m',n:32},'denisse':{g:'f',n:52},'diana':{g:'f',n:300},'diego':{g:'m',n:79},'dolores':{g:'f',n:336},'domingo':{g:'m',n:83},'dora':{g:'f',n:179},'dulce':{g:'f',n:204},'edgar':{g:'m',n:296},'edgardo':{g:'m',n:37},'edith':{g:'f',n:389},'edmundo':{g:'m',n:54},'edna':{g:'f',n:67},'eduardo':{g:'m',n:469},'edwin':{g:'m',n:27},'efrain':{g:'m',n:118},'efren':{g:'m',n:68},'elba':{g:'f',n:66},'elda':{g:'f',n:71},'eleazar':{g:'m',n:54},'elena':{g:'f',n:917},'elia':{g:'f',n:153},'elias':{g:'m',n:70},'eligio':{g:'m',n:26},'elisa':{g:'f',n:131},'eliseo':{g:'m',n:44},'elizabeth':{g:'f',n:811},'eloisa':{g:'f',n:82},'eloy':{g:'m',n:48},'elsa':{g:'f',n:174},'elva':{g:'f',n:119},'elvia':{g:'f',n:186},'elvira':{g:'f',n:214},'emilia':{g:'f',n:76},'emiliano':{g:'m',n:25},'emilio':{g:'m',n:82},'emma':{g:'f',n:111},'emmanuel':{g:'m',n:88},'enedina':{g:'f',n:55},'enrique':{g:'m',n:617},'enriqueta':{g:'f',n:69},'erasmo':{g:'m',n:35},'erendira':{g:'f',n:60},'eric':{g:'m',n:36},'erick':{g:'m',n:52},'erik':{g:'m',n:52},'erika':{g:'f',n:312},'ernestina':{g:'f',n:59},'ernesto':{g:'m',n:237},'esmeralda':{g:'f',n:174},'esperanza':{g:'f',n:183},'esteban':{g:'m',n:103},'estela':{g:'f',n:328},'esthela':{g:'f',n:59},'esther':{g:'f',n:380},'eugenia':{g:'f',n:296},'eugenio':{g:'m',n:59},'eusebio':{g:'m',n:45},'eva':{g:'f',n:179},'evangelina':{g:'f',n:80},'evaristo':{g:'m',n:27},'evelia':{g:'f',n:73},'everardo':{g:'m',n:47},'ezequiel':{g:'m',n:51},'fabian':{g:'m',n:60},'fabiola':{g:'f',n:265},'fatima':{g:'f',n:58},'faustino':{g:'m',n:45},'fausto':{g:'m',n:37},'federico':{g:'m',n:79},'feliciano':{g:'m',n:34},'felipe de jesus':{g:'m',n:80},'felipe':{g:'m',n:247},'felix':{g:'m',n:110},'fermin':{g:'m',n:51},'fernando':{g:'m',n:534},'fidel':{g:'m',n:97},'filiberto':{g:'m',n:39},'flor':{g:'f',n:118},'florencio':{g:'m',n:45},'florentino':{g:'m',n:33},'fortino':{g:'m',n:22},'francisca':{g:'f',n:287},'francisco':{g:'m',n:1147},'fredy':{g:'m',n:29},'gabino':{g:'m',n:29},'gabriel':{g:'m',n:296},'gabriela':{g:'f',n:633},'gamaliel':{g:'m',n:27},'genaro':{g:'m',n:71},'genoveva':{g:'f',n:55},'georgina':{g:'f',n:173},'gerardo':{g:'m',n:381},'german':{g:'m',n:92},'gilberto':{g:'m',n:179},'gildardo':{g:'m',n:29},'gisela':{g:'f',n:68},'gladys':{g:'f',n:62},'gloria':{g:'f',n:495},'gonzalo':{g:'m',n:79},'graciela':{g:'f',n:275},'gregorio':{g:'m',n:132},'griselda':{g:'f',n:154},'guadalupe':{g:'f',n:2393},'guadalupe':{g:'m',n:288},'guillermina':{g:'f',n:181},'guillermo':{g:'m',n:270},'gustavo':{g:'m',n:202},'hector':{g:'m',n:396},'heriberto':{g:'m',n:65},'herlinda':{g:'f',n:54},'hermelinda':{g:'f',n:76},'hernan':{g:'m',n:30},'hilario':{g:'m',n:40},'hilda':{g:'f',n:261},'hipolito':{g:'m',n:32},'homero':{g:'m',n:36},'horacio':{g:'m',n:61},'hortencia':{g:'f',n:81},'hugo':{g:'m',n:345},'humberto':{g:'m',n:249},'idalia':{g:'f',n:71},'ignacio':{g:'m',n:232},'iliana':{g:'f',n:56},'imelda':{g:'f',n:149},'ines':{g:'f',n:139},'irene':{g:'f',n:218},'iris':{g:'f',n:71},'irma':{g:'f',n:495},'isaac':{g:'m',n:76},'isabel':{g:'f',n:777},'isabel':{g:'m',n:34},'isaias':{g:'m',n:67},'isela':{g:'f',n:202},'isidro':{g:'m',n:82},'ismael':{g:'m',n:131},'israel':{g:'m',n:156},'itzel':{g:'f',n:69},'ivan':{g:'m',n:256},'ivette':{g:'f',n:72},'ivonne':{g:'f',n:149},'jacinto':{g:'m',n:32},'jacobo':{g:'m',n:24},'jaime':{g:'m',n:320},'janet':{g:'f',n:84},'janeth':{g:'f',n:77},'javier':{g:'m',n:837},'jazmin':{g:'f',n:102},'jeronimo':{g:'m',n:24},'jessica':{g:'f',n:91},'jesus':{g:'f',n:127},'jesus':{g:'m',n:1178},'joaquin':{g:'m',n:104},'joel':{g:'m',n:183},'jonathan':{g:'m',n:36},'jorge':{g:'m',n:906},'jose de jesus':{g:'m',n:113},'jose':{g:'m',n:3519},'josefina':{g:'f',n:337},'josue':{g:'m',n:89},'juan de dios':{g:'m',n:32},'juan':{g:'m',n:1809},'juana':{g:'f',n:654},'judith':{g:'f',n:232},'julia':{g:'f',n:177},'julian':{g:'m',n:88},'julieta':{g:'f',n:121},'julio':{g:'m',n:319},'justino':{g:'m',n:32},'juventino':{g:'m',n:24},'karen':{g:'f',n:75},'karina':{g:'f',n:329},'karla':{g:'f',n:262},'laura':{g:'f',n:870},'lazaro':{g:'m',n:38},'lenin':{g:'m',n:26},'leobardo':{g:'m',n:43},'leonardo':{g:'m',n:90},'leonel':{g:'m',n:69},'leonor':{g:'f',n:96},'leopoldo':{g:'m',n:49},'leticia':{g:'f',n:979},'lidia':{g:'f',n:213},'lilia':{g:'f',n:378},'liliana':{g:'f',n:277},'lizbeth':{g:'f',n:145},'lizeth':{g:'f',n:127},'lorena':{g:'f',n:378},'lorenzo':{g:'m',n:94},'lourdes':{g:'f',n:322},'lucero':{g:'f',n:72},'lucia':{g:'f',n:328},'luciano':{g:'m',n:32},'lucila':{g:'f',n:85},'lucina':{g:'f',n:51},'lucio':{g:'m',n:47},'luis':{g:'m',n:1670},'luisa':{g:'f',n:433},'luz':{g:'f',n:741},'magdalena':{g:'f',n:348},'manuel de jesus':{g:'m',n:42},'manuel':{g:'m',n:1290},'manuela':{g:'f',n:70},'marcela':{g:'f',n:189},'marcelino':{g:'m',n:56},'marcelo':{g:'m',n:37},'marco':{g:'m',n:298},'marcos':{g:'m',n:109},'margarita':{g:'f',n:744},'margarito':{g:'m',n:50},'maria de jesus':{g:'f',n:287},'maria de la luz':{g:'f',n:156},'maria de los angeles':{g:'f',n:323},'maria de lourdes':{g:'f',n:294},'maria del carmen':{g:'f',n:555},'maria del pilar':{g:'f',n:109},'maria del refugio':{g:'f',n:73},'maria del rocio':{g:'f',n:113},'maria del rosario':{g:'f',n:301},'maria del socorro':{g:'f',n:156},'maria':{g:'f',n:9002},'maria':{g:'m',n:76},'mariana':{g:'f',n:103},'mariano':{g:'m',n:40},'maribel':{g:'f',n:325},'maricela':{g:'f',n:247},'mariela':{g:'f',n:57},'marina':{g:'f',n:146},'mario':{g:'m',n:450},'marisela':{g:'f',n:98},'marisol':{g:'f',n:229},'maritza':{g:'f',n:62},'marlene':{g:'f',n:89},'marta':{g:'f',n:60},'martha':{g:'f',n:1268},'martin':{g:'m',n:504},'martina':{g:'f',n:89},'mateo':{g:'m',n:27},'matilde':{g:'f',n:71},'mauricio':{g:'m',n:91},'mauro':{g:'m',n:37},'maximino':{g:'m',n:34},'maximo':{g:'m',n:22},'mayra':{g:'f',n:236},'mercedes':{g:'f',n:172},'micaela':{g:'f',n:75},'miguel':{g:'m',n:886},'milton':{g:'m',n:23},'minerva':{g:'f',n:156},'mireya':{g:'f',n:144},'miriam':{g:'f',n:267},'mirna':{g:'f',n:128},'misael':{g:'m',n:42},'modesto':{g:'m',n:30},'moises':{g:'m',n:121},'monica':{g:'f',n:307},'monserrat':{g:'f',n:62},'nadia':{g:'f',n:82},'nallely':{g:'f',n:56},'nancy':{g:'f',n:244},'natalia':{g:'f',n:60},'natividad':{g:'f',n:99},'nayeli':{g:'f',n:80},'nelly':{g:'f',n:98},'nestor':{g:'m',n:50},'nicolas':{g:'m',n:125},'nidia':{g:'f',n:64},'noe':{g:'m',n:144},'noel':{g:'m',n:38},'noemi':{g:'f',n:164},'nohemi':{g:'f',n:99},'nora':{g:'f',n:155},'norberto':{g:'m',n:42},'norma':{g:'f',n:660},'octavio':{g:'m',n:146},'ofelia':{g:'f',n:141},'olga':{g:'f',n:269},'olivia':{g:'f',n:218},'omar':{g:'m',n:258},'oralia':{g:'f',n:79},'orlando':{g:'m',n:70},'oscar':{g:'m',n:393},'osvaldo':{g:'m',n:34},'oswaldo':{g:'m',n:44},'pablo':{g:'m',n:234},'paola':{g:'f',n:101},'pascual':{g:'m',n:38},'patricia':{g:'f',n:1125},'patricio':{g:'m',n:25},'paula':{g:'f',n:94},'paulina':{g:'f',n:66},'pedro':{g:'m',n:514},'perla':{g:'f',n:126},'petra':{g:'f',n:87},'pilar':{g:'f',n:52},'porfirio':{g:'m',n:34},'rafael':{g:'m',n:409},'ramiro':{g:'m',n:104},'ramon':{g:'m',n:307},'ramona':{g:'f',n:70},'raquel':{g:'f',n:218},'raul':{g:'m',n:419},'raymundo':{g:'m',n:100},'rebeca':{g:'f',n:136},'refugio':{g:'m',n:28},'rene':{g:'m',n:165},'rey':{g:'m',n:31},'reyes':{g:'m',n:51},'reyna':{g:'f',n:219},'reynaldo':{g:'m',n:60},'ricardo':{g:'m',n:408},'rigoberto':{g:'m',n:78},'rita':{g:'f',n:71},'roberto':{g:'m',n:478},'rocio':{g:'f',n:429},'rodolfo':{g:'m',n:180},'rodrigo':{g:'m',n:107},'rogelio':{g:'m',n:169},'roger':{g:'m',n:27},'rolando':{g:'m',n:63},'roman':{g:'m',n:85},'rosa':{g:'f',n:1356},'rosalba':{g:'f',n:150},'rosalia':{g:'f',n:103},'rosalinda':{g:'f',n:66},'rosalio':{g:'m',n:23},'rosario':{g:'f',n:228},'rosario':{g:'m',n:29},'rosaura':{g:'f',n:59},'rosendo':{g:'m',n:27},'ruben':{g:'m',n:318},'rubi':{g:'f',n:72},'ruth':{g:'f',n:145},'sabino':{g:'m',n:23},'salomon':{g:'m',n:38},'salvador':{g:'m',n:261},'samuel':{g:'m',n:104},'sandra':{g:'f',n:519},'santa':{g:'f',n:55},'santiago':{g:'m',n:118},'santos':{g:'m',n:86},'sara':{g:'f',n:193},'saul':{g:'m',n:158},'sebastian':{g:'m',n:34},'selene':{g:'f',n:116},'sergio':{g:'m',n:423},'silvestre':{g:'m',n:33},'silvia':{g:'f',n:662},'simon':{g:'m',n:35},'socorro':{g:'f',n:173},'sofia':{g:'f',n:169},'soledad':{g:'f',n:143},'sonia':{g:'f',n:244},'susana':{g:'f',n:326},'tania':{g:'f',n:87},'teodoro':{g:'m',n:24},'teresa de jesus':{g:'f',n:96},'teresa':{g:'f',n:593},'teresita':{g:'f',n:54},'tomas':{g:'m',n:161},'tomasa':{g:'f',n:58},'trinidad':{g:'f',n:98},'trinidad':{g:'m',n:58},'ubaldo':{g:'m',n:30},'ulises':{g:'m',n:102},'uriel':{g:'m',n:56},'valentin':{g:'m',n:49},'vanessa':{g:'f',n:83},'veronica':{g:'f',n:616},'vicente':{g:'m',n:145},'victor':{g:'m',n:593},'victoria':{g:'f',n:213},'violeta':{g:'f',n:70},'virgilio':{g:'m',n:27},'virginia':{g:'f',n:280},'viridiana':{g:'f',n:69},'vladimir':{g:'m',n:35},'wendy':{g:'f',n:58},'wilbert':{g:'m',n:23},'xochitl':{g:'f',n:138},'yadira':{g:'f',n:239},'yanet':{g:'f',n:51},'yareli':{g:'f',n:99999},'yazmin':{g:'f',n:125},'yesenia':{g:'f',n:109},'yolanda':{g:'f',n:548}
    }
    // END OF deities and names lists
  },
  // END MAP SECTION

  //////////////////////////
  //
  // isAtomicLetter
  //
  //////////////////////////
  isAtomicLetter:function(c){
    return ato.all.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicVowel
  //
  //////////////////////////
  isAtomicVowel:function(c){
    return ato.vowels.all.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicConsonant
  //
  //////////////////////////
  isAtomicConsonant:function(c){
    return ato.consonants.all.indexOf(c) != -1;
  },
  ///////////////////////////
  //
  // isForeignConsonant
  //
  ///////////////////////////
  isForeignConsonant:function(c){
    return ato.consonants.foreign.indexOf(c) != -1;
  },
  // toUnmarkedVowel: removes long vowel marker:
  toUnmarkedVowel:function(v){
    return v==='ā'?'a':v==='ē'?'e':v==='ī'?'i':v==='ō'?'o':v==='ū'?'u':v;
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
  // atomicToIPA:
  //
  // => This is the first-stage
  //    /fənimɪk/ version
  //
  /////////////////////////////////////////
  atomicToIPA:function(atomic){
    let ipa = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        ipa += nwt.map.atomic[current].ipa;
      }else{
        ipa += current;
      }
    }
    return ipa;
  },
  /////////////////////////////////////////
  //
  // atomicToDegeminate: Removes geminated
  // consonants from an atomic word string
  //
  /////////////////////////////////////////
  atomicToDegeminate:function(atomic){
    let degem = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      // Check for gemination and keep only the first consonant:
      if(nwt.isAtomicConsonant(current) && i<atomic.length && atomic[i+1]===current){
        degem += current;
        // Force skipping of second consonant:
        ++i;
      }else{
        degem += current;
      }
    }
    return degem;
  },
  ////////////////////////////////////////////
  //
  // atomicAllophoneN2H:
  // 
  // (1) Used only when converting from an "M"
  //     to an "F" orthography.
  //
  // -> Convert things like "tzin" to "tzih"
  // -> MUST BE USED IN CONJUNCTION WITH 
  //    APPROPRIATE WORD-LEVEL EXCLUSION LIST
  //
  ////////////////////////////////////////////
  atomicAllophoneN2H:function(atomic){
    //
    // This performs an *UNFILTERED*
    // replacement of terminal /n/ to [h].
    // 
    // NOTA BENE 1: THIS CAN ONLY BE USED
    // IN A USEFUL MANNER WITH A WORD-LEVEL
    // EXCLUSION LIST. SO ONLY USE THIS IN
    // A WORD-BASED CONVERSION PIPELINE.
    // 
    // NOTA BENE 2: Javascript's RegExp '\b' IS
    // *BROKEN* FOR UNICODE, SO WE HAVE THE 
    // FOLLOWING:
    //
    // This should handle most of the cases:
    atomic = atomic.replace(/n([ \t\.!?"᾽»’„”])/,(match,p1)=>{
      console.log(`MATCH: ${match}`);
      return `h${p1}`;
    });
    // End-of-string case (this is in fact
    // the case that will always appear when
    // using a word-based conversion pipeline):
    atomic = atomic.replace(/n$/,'h');
    return atomic;
  },
  /////////////////////////////////////////////
  //
  // atomicAllophoneH2N
  //
  /////////////////////////////////////////////
  atomicAllophoneH2N:function(atomic){
    // Conversion in this direction will be
    // much harder to get right:
    // 1.
    atomic = atomic.replace(/tzih?\b/g,'tzin');
    // 2.
    atomic = atomic.replace(/ςih\b/g,'ςin'); // michin, cuatochin etc.
    // 2.1. But if "lechih" or "pechih" were accidently converted, back convert them:
    atomic = atomic.replace(/leςin\b/,'leςih');
    atomic = atomic.replace(/peςin\b/,'peςih');
    // 3.
    atomic = atomic.replace(/lih\b/g,'lin');
    // 3.1. But if "kikilih" was accidently converted, back convert:
    atomic = atomic.replace(/kikilin\b/,'kikilih');
    // 4.
    atomic = atomic.replace(/tin\b/,'tih');
    // 4.1 But back convert misconversions:
    
    return atomic;
  },
  /////////////////////////////////////////
  //
  // atomicToPhoneticSyllabified: Syllabifies
  // an atomic word string by adding dots
  // '.' between syllables
  // 
  // NOTA BENE: Syllabification here is
  // for the PHONETIC LEVEL "GREEDY ONSET"
  // syllabification. The PHONEMIC level
  // could be different.
  //
  //////////////////////////////////////////
  atomicToPhoneticSyllabified:function(atomic){
    let sylab = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicVowel(current) 
        && i<atomic.length-1 
        && nwt.isAtomicConsonant(atomic[i+1])
        && nwt.isAtomicVowel(atomic[i+2]) ){
        // VCV pattern => V.CV
        sylab += current;
        sylab += '.';
      }else if(nwt.isAtomicConsonant(current) 
        && i<atomic.length 
        && nwt.isAtomicConsonant(atomic[i+1])){
        // CC pattern => C.C
        sylab += current;
        sylab += '.';
      }else if(nwt.isAtomicVowel(current)
        && i< atomic.length
        && nwt.isAtomicVowel(atomic[i+1])){
        // VV pattern => V.V
        sylab += current;
        sylab += '.';
      }else{
        // pass through:
        sylab += current;
      }
    }
    return sylab;
  },
  /////////////////////////////////////////
  //
  // markStress: Mark stress on the 
  // penultimate syllable of a syllabified
  // atomic word string, s
  //
  /////////////////////////////////////////
  markStress:function(s){
    // Work from end of string moving
    // toward the beginning:
    const marker = 'ˈ';
    let syllableCount = 0;
    let letterSeen = false;
    for(i = s.length-1;i>=0;i--){
      if(nwt.isAtomicLetter(s[i])){
        letterSeen=true;
        if(i===0 && syllableCount===1){
          s = [marker,s].join('');
          return s;
        }
        // DEBUG:
        // console.log(`letter "${s[i]}" seen at ${i} with sylCnt=${syllableCount} and letSeen=${letterSeen}`);
      }else if(letterSeen && ( s[i]==='.')){
        syllableCount++;
        if(syllableCount===2){
          // Mark penultimate syllable 
          // with stress marker:
          s = [s.slice(0, i ),marker,s.slice( i+1 )].join('');
        }
      }else if(s[i]===' '){
        if(letterSeen && syllableCount===1){
          // So we have already seen one syllable marked with '.'
          // Mark penultimate syllable 
          // with stress marker:
          s = [s.slice(0, i+1 ),marker,s.slice( i+1 )].join('');
        }
        // White space resets the counter:
        syllableCount = 0;
        letterSeen    = false;
      }
    }
    return s;
  },
  /////////////////////////////////////////
  //
  // atomicToIPAPhonetic:
  //
  // => This is the second stage [fəˈnɛ.tɪk]
  //    version
  //
  /////////////////////////////////////////
  atomicToIPAPhonetic:function(atomic){
    // Degeminate the word string:
    const degem = nwt.atomicToDegeminate(atomic);
    // syllabify at the PHONETIC level:
    const sylab = nwt.atomicToPhoneticSyllabified(degem);
    // Add stress marker:
    const stres = nwt.markStress(sylab);
    // Convert to IPA:
    return nwt.atomicToIPA(stres);
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
        if(next==='e' || next==='i' || next==='ē' || next==='ī'){
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
      
      if(nwt.isAtomicVowel(current) && nwt.isAtomicConsonant(previous) && previous!=='h' ){
        // Convert atomic vowels following consonants immediately 
        // to above-base vowel signs *EXCEPT* in the case of 'h' which can only be a terminal:
        if(current==='a'){
          // Don't push anything because the vowel /a/ sign is intrinsic 
          // and not normally written over the abugida base consonant
        }else if(current==='ā'){
          // In this case, only add the longVowelSign marker, but not the intrinic /a/ vowelSign symbol:
          result += nab.longVowelSign;
        }else{
          result += nab.map.atomicVowelToVowelSign[current];
        }
      }else if(nwt.isAtomicVowel(current) && previous==='h' && (i===1 || !nwt.isAtomicLetter(atomic[i-2])) ){
        // This is the special case where atomic 'h' starts a word (which therefore means it is actually
        // a borrow word, not a native Nahuatl word) and now we have a vowel, so in this case the vowel
        // become a vowel sign over the 'h' consonant. Although this case could be folded into the previous
        // "if" section, it is kept apart here for clarity: 
        if(current==='a'){
          // Don't push anything because the vowel /a/ sign is intrinsic 
          // and not normally written over the abugida base consonant
        }else if(current==='ā'){
          // In this case, only add the longVowelSign marker, but not the intrinic /a/ vowelSign symbol:
          result += nab.longVowelSign;
        }else{
          result += nab.map.atomicVowelToVowelSign[current];
        }
      }else if( current==='h' && nwt.isAtomicVowel(previous) ){
        // Special case where we only allow atomic 'h' to be a *terminal* consonant on syllabic clusters
        // and never at the beginning of cluster *unless* it is the first consonant in a foreign borrow word
        // (so this clause *must* precede the following clause which treats all the other consonants in 
        // a general fashion):
        result += nab.subjoinerSign;
        result += nwt.map.atomic[current].nab;   // Push consonant
      }else if(nwt.isAtomicConsonant(current) && nwt.isAtomicVowel(previous) && !nwt.isAtomicVowel(next) ){
        // If the previous letter is a vowel and this is a consonant, then we have to think about making
        // consonant a subjoined consonant. However, if the *next* letter is a vowel, then this consonant
        // is actually the base for the next syllabic cluster. But if the *next* letter is *not* a vowel,
        // then indeed this consonant is a final consonant on the current syllabic cluster. So we have:
        result += nab.subjoinerSign;             // Push subjoiner
        result += nwt.map.atomic[current].nab;   // Push consonant
      }else if(nwt.isAtomicVowel(current) && nwt.isAtomicVowel(previous) && !(i===1 || !nwt.isAtomicLetter(atomic[i-2])) ){
        // 2020.12.24.ET: Added new constraint in the if clause: don't use compound signs if word starts with a vowel
        // Opportunity for combined vowel sign:
        // 2020.12.24.ET ADDENDA: As there does not appear to be a 
        // reasonable way to include vowel length indicators on compound 
        // vowel signs, the decision here is to ignore the vowel length
        // by folding the short and long vowels together:
        const prevVowel = nwt.toUnmarkedVowel(previous);
        const vowelPair = prevVowel + nwt.toUnmarkedVowel(current);
        const compoundSign = nab.map.atomicVowelPairsToCompoundVowelSign[vowelPair];
        if(compoundSign){
          // The vowel combination has a special combined symbol, so replace
          // the current singleton vowel sign with the compound vowel sign.
          //
          // However, in the case of a previous 'a', then there is no visible sign
          // so in that case, just add the combined symbol at the end, as there is
          // nothing to replace:
          if(previous==='a'){
            result += compoundSign;
          }else if(previous==='ā'){
            // Remove the nab.longVowelSign marker only, then add the compound sign:
            result = result.slice(0, -1 ) + compoundSign;
          }else{
            // if prevVowel != previous, this means "previous" is actually
            // a *long vowel* which means that result will already have both the
            // vowel sign *AND* the long vowel indicator, so in that case we
            // must remove both:
            result = result.slice(0, prevVowel===previous ? -1 : -2 ) + compoundSign;
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
    const matches = s.match(/(ko|λan|tepek|τinco|singo|apa|apan|kan)\b/);
    if(matches && matches[1]){
      //
      // This is a strong indication of a locative suffix on a nahuatl
      // word. 
      // 
      // BUT if the beginning of the word contains foreign consonants,
      // then it is very likely *NOT* a Nahuatl word. A good example is the
      // name "Francisco" which looks to have "co" at the end, but is
      // clearly not nahuatl.
      //
      // So here we add this refinement to insure that we return false 
      // for words like "Fransisco" but true for words like "Telpancingo" ...
      //
      const firstPart = s.substring(0,matches.index);
      for(let i=0;i<firstPart.length;i++){
        if(nwt.isForeignConsonant(firstPart[i])){
          return false;
        }
      }
      // Get here if no foreign consonants, so:
      return true;
    }else{
      return false;
    }
  },
  /////////////////////////////////
  //
  // stripPunctuation:
  //
  /////////////////////////////////
  stripPunctuation:function(s){
    return s.replace(/[\.,—–‒\/#!¡$%\^&\*;:{}=\-_`~()@\+\?¿><\[\]\+"'“”«»‘’‛‹›…]/g, '');
  },
  ////////////////////////////////////////////////////////////
  //
  // isDeity: true if the name is in the list of deities
  //
  // NOTA BENE: This works on a name in ATOMIC orthography
  //
  ////////////////////////////////////////////////////////////
  isDeity:function(name){
    return nwt.map.deities[nwt.stripPunctuation(name)];
  },
  //////////////////////////////////////////////
  // 
  // isPersonName: returns true if name is in the
  //           list of people's names
  //
  //////////////////////////////////////////////
  isPersonName:function(name){
    const personObject = nwt.map.people[name.toLowerCase()];
    return !!(personObject ? personObject.n : 0);
  },
  /////////////////////////////////////////
  //
  // splitToMetaWords
  //
  /////////////////////////////////////////
  splitToMetaWords:function(input){
    //const words = input.split(/[\.\,\!\?]| +/);
    const words = input.split(/ +/);

    const metaWords=[];
    for(let word of words){
      const mw = {}; // meta-word object
      mw.original       = word;
      mw.atomic         = nwt.toAtomic( word.toLowerCase() );
      const firstLetter = word[0];
      // flic = first letter is capital
      mw.flic           = firstLetter ? firstLetter===firstLetter.toUpperCase() : false; // flic
      mw.isPlace        = nwt.hasLocativeSuffix( mw.atomic );
      mw.isDeity        = nwt.isDeity( mw.atomic );
      // Now using the much more comprehensive names.js module:
      mw.isPerson       = nms.isName( nwt.stripPunctuation(mw.original) );
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

exports.nab = nab;
exports.nwt = nwt;
exports.alo = alo;
// END OF CODE 

