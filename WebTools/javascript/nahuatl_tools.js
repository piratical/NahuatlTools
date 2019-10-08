deities: map of Nahuatl deity names
    // (in ATOMIC orthography)
    //
    // NOTA BENE: This list was originally based on 
    // https://en.wikipedia.org/wiki/List_of_Aztec_gods_and_supernatural_beings
    //
    //////////////////////////////////////////
    deities:{
      'awiateteo':1,'amapan':1,'aλakoya':1,'aλawa':1,'aλatoman':1,'kamaxλi':1,'senτonwiτnawa':1,'senτonmimixkoa':1,'senτontotoςtin':1,'ςalςiwλiκe':1,'ςalςiwtotolin':1,'ςalmekkasiwaλ':1,'ςantiko':1,'ςikomekoaλ':1,'ςikomexoςiλ':1,'ςimalma':1,'siwakoaλ':1,'siwateteo':1,'sinteoλ':1,'sinteoλ':1,'sinteteo':1,'sipaktonal':1,'siλalatonak':1,'siλaliκe':1,'koasiwaλ':1,'koaλiκe':1,'koaλiκe':1,'kolwaτinkaλ':1,'koyolxawki':1,'kosawkasinteoλ':1,'ehekaλ':1,'wewekoyoλ':1,'wewekoyoλ':1,'weweteoλ':1,'wiτilopoςλi':1,'wiτilopoςλi':1,'wixtosiwaλ':1,'iixposteke':1,'ilamateκthli':1,'iτkake':1,'iτpapaloλ':1,'iτpapaloλ':1,'iτpapaloλsiwaλ':1,'iτpapaloλtotek':1,'iτλakoliwki':1,'iτλi':1,'ixkimilli':1,'ixkitekaλ':1,'ixλilton':1,'istaκkasinteoλ':1,'maκilkoskaκawλi':1,'maκilκeτpalin':1,'maκilmalinalli':1,'maκiltoςλi':1,'maκiltoςλi':1,'maκiltotek':1,'maκilxoςiλ':1,'malinalxoςiλ':1,'mayawel':1,'meτλi':1,'mikapeλakalli':1,'miktekasiwaλ':1,'mikλanteκλi':1,'mixkoaλ':1,'mixkoaλ':1,'nanawaτin':1,'nappateκλi':1,'nesoxoςi':1,'nextepewa':1,'omakaλ':1,'omesiwaλ':1,'ometeκλi':1,'ometeoλ':1,'ometoςλi':1,'opoςλi':1,'oxomo':1,'painal':1,'patekaλ':1,'pilτinteκλi':1,'kawsiwaλ':1,'keτalkoaλ':1,'kilasli':1,'teksistekaλ':1,'teςloλ':1,'temaskaltesi':1,'tepeyolloλ':1,'tepostekaλ':1,'texkaτonaλ':1,'teskaλipoka':1,'teskaτonkaλ':1,'λakawepan':1,'λakoτonλi':1,'λawiskalpanteκλi':1,'λalsiwaλ':1,'λalok':1,'λalok':1,'λaloke':1,'λaltekayoa':1,'λalteκλi':1,'λaλawkasinteoλ':1,'λasolteoλ':1,'λasolteoλ':1,'λilwa':1,'tosi':1,'toltekaλ':1,'tonakasiwaλ':1,'tonakateκλi':1,'tonatiw':1,'tonatiw.':1,'τiτimimeh':1,'τiτiminsiwaλ':1,'τiτimiλ':1,'τontemok':1,'xilonen':1,'xipetotek':1,'xipetotek':1,'xipetotek':1,'xippilli':1,'xiwkosawki':1,'xiwistaκki':1,'xiwteκλi':1,'xiwteκλi':1,'xiwλaλawki':1,'xiwtotonλi':1,'xiwxoxoawki':1,'xoςipilli':1,'xoςikeτal':1,'xoςiλiκe':1,'xoςiλiκe':1,'xoloλ':1,'xoloλ':1,'yakateκλi':1,'yakateκλi':1,'yaosiwaλ':1,'yayawkasinteoλ':1,'sakaτonλi':1,'sakaτonλi':1,'dios':1
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
    return s.match(/(ko|λan|tepek|τinco|singo|apa|apan|kan)$/);
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

