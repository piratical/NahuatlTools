//////////////////////////////////////////////////
//
// verb_parser.js
//
// This is a very rough first draft implementation
// for parsing Nahuatl verb forms to get to the
// verb stem.
//
// 2021.01.01.ET
//
///////////////////////////////////////////////////
if(process.argv.length!=3){
  console.error('Please specify a verb form to test on the command line');
  return 1;
}

// The verb form to process:
const verbForm = process.argv[2];


const hasl_cons=['m','n','p','t','k','ku','tz','tl','ch','s','l','x','h','y','w'];
const atom_cons=['m','n','p','t','k','κ' ,'τ' ,'λ' ,'ς' ,'s','l','x','h','y','w'];

const generalPatternString = '([a-z].*)';
//////////////////////////////////////////////////////
//
// verb list:
// This is largely based on Cambell & Karttunen's 
// lists. This is not complete, but it is a start.
//
//////////////////////////////////////////////////////
const verbList=[
 '(?:chi)?chinoa', 'a(?:yi?}x)', 'ahsi', 'ahwa', 'altia', 'amiki?', 'apismiki?', 'ati(?:ya?|x)', 'awi(?:ya?|x)', 'axitia',
 'axkatia', 'chalani?', 'chanti', 'chi(?:ya?|x)', 'chikawa?', 'chikoihtoa', 'chipawa?', 'chiwa?', 'chiwaltia', 'choca',
 'chokaltia', 'choloa', 'chololtia', 'chololtia', 'etix', 'etiya?', 'ewa?', 'huetzca', 'huetzi?', 'i?hchinoa',
 'i?hkuiloa', 'i?hnekui?', 'i?htlakoa', 'i?htoa', 'i?htzo(?:ma?|n)', 'i?hyaya', 'i?lakatzoa', 'i?lkawa?', 'i?lnamiki?', 'i?lpia',
 'i?lteki?', 'i?lwia', 'i?tki', 'i?tki', 'i?tta', 'i?xka', 'i?xtlawa?', 'ihka', 'ihtani?', 'ihtlani?',
 'ihtotia', 'ihwi?', 'iksa', 'imakasi?', 'ina(?:ya?|x)', 'ittaltia', 'ixlawa?', 'ixma(?:ti?|h)', 'ixpahtia', 'kaki?',
 'kakiltia', 'kakkopina?', 'kalaki?', 'kallalia', 'kaltzakua', 'kawa?', 'kechteki?', 'kemi?', 'ketza?', 'kisa?',
 'kixtia', 'kochi?', 'kochmiki?', 'kochteka', 'kochtlasa?', 'kopina?', 'kotona?', 'kowa?', 'kuah?', 'kualtia',
 'kualani?', 'kualantia', 'kualitta', 'kuepa?', 'kueponi?', 'kui', 'ma', 'ma(?:ti?|h)', 'maca', 'machtia',
 'mah?', 'maka', 'malina?', 'mamah?', 'mamaltia', 'manotza?', 'mawtia', 'mayawi?', 'melawa?', 'miki?',
 'mikiltia', 'miktia', 'mina?', 'motla', 'namaka', 'namiki?', 'namikiltia', 'ne(?:n|mi?)', 'nehne(?:n|mi?)', 'neki?',
 'nekiltia', 'neloa', 'neltoka', 'nesi?', 'newatia', 'noh?notza?', 'notza?', 'o(?:ya?}x)', 'ohtlatoka', 'onahsi',
 'pachoa', 'pactia', 'pah?', 'pahti', 'pahtia', 'paka?', 'pakaltia', 'paki?', 'paktia', 'palani?',
 'palewia', 'patlani?', 'pawasi?', 'pehpena?', 'petlwa?', 'pewa?', 'pewaltia', 'pi', 'pilka', 'pinawa',
 'pitza?', 'pitzini?', 'piya?', 'poliwi?', 'poloa', 'posoni?', 'posonia', 'posteki?', 'powa?', 'saka',
 'saloa', 'se(?:ya?|s)', 'seli(?:ya?|s)', 'selia', 'so', 'sotlawa', 'tamachiwa?', 'tataka', 'te(?:ma?|n)', 'teka',
 'teki?', 'tekiti', 'tekitiltia', 'temi?', 'temiki?', 'temo', 'temoa', 'tena', 'tenaltia', 'tenewa?',
 'tennamiki?', 'teochiwa?', 'tepotzihtoa', 'tesi', 'tiamiki?', 'tisi', 'titlani?', 'tla(?:mi?|n)', 'tlachix', 'tlachiya?',
 'tlachiyaltia', 'tlachpana?', 'tlahtlania', 'tlahtoa', 'tlakati?', 'tlakatilia', 'tlakualtia', 'tlalia', 'tlapana?', 'tlapoa',
 'tlasa?', 'tlasaltia', 'tlasohtla', 'tlatia', 'tlatsini?', 'tlawana', 'tlawanaltia', 'tlawia', 'tlawiltia', 'tlaxtlawa',
 'tlehko', 'to(?:mi?|n)', 'toka', 'tolinia', 'tzahtzi', 'tzakua?', 'tzayana?', 'tzekuini?', 'tzitzkia', 'tzoyonia',
 'walahsi', 'walwika', 'wika', 'witeki?', 'xeliwi?', 'xeloa', 'xima?', 'xipewa?', 'yakana?', 'yekoa',
 'yoko(?:ya?|x)','yoli?','yollalia','yowa','zoma'
];

/////////////////////////////////////////////////
//
// arrayToRegexOptionGroup
//
// NOTE: This also sorts the array in place
//       in order to put longest options first
//       which is what you will want for proper
//       behavior in your regular expression.
//
/////////////////////////////////////////////////
function arrayToRegexOptionGroup(arr){
  // Sort to longest strings first.
  // Since we are sorting in descending order by
  // length, it seems reasonable to also do
  // the nested alphabetic sort in reverse order too.
  // This nested sort is not critical, but makes it a
  // little bit easier for human eyes:
  arr.sort( (a,b)=>{
    return b.length-a.length || b.localeCompare(a);
  });
  return '('+arr.join('|')+')';
}

// reverse
function reverse(str){
  return str.split('').reduce((reversed, character) => character + reversed, '');
}

// reverseArrayToRegexOptionGroup
function reverseArrayToRegexOptionGroup(arr){
  arr.sort( (a,b)=>{
    return a.length-b.length || a.localeCompare(b);
  });
  return '('+reverse(arr.join('|'))+')?';
}

//
// verbArrayToRegexOptionGroup(arr)
//
function verbArrayToRegexOptionGroup(arr){
  // Sort to longest strings first.
  // Since we are sorting in descending order by
  // length, it seems reasonable to also do
  // the nested alphabetic sort in reverse order too.
  // This nested sort is not critical, but makes it a
  // little bit easier for human eyes:
  arr.sort( (a,b)=>{
    return b.length-a.length || b.localeCompare(a);
  });
  // This forces matching to any specific option first, with the [a-z]+ option as a final resort:
  return '('+arr.join('|')+'|[a-z]+)?';
}

// iVerbStems:
iVerbStems=[
 'ikana',
 'ikxi',
 'ichteki',
 'isiowil',
 'ikpow',
 'iih',
 'iil',
 'iix',
 'ilaka',
 'ilkaw',
 'ilwi',
 'illa',
 'ilpi',
 'inama',
 'itta',
 'itzki',
 'itz',
 'ikw',
 'iyoka',
 'iska',
 'isti',
 'istla',
];

const iVerbPattern = arrayToRegexOptionGroup(iVerbStems);
const iVerbRegex   = new RegExp('^'+iVerbPattern);


//////////////////////////////////////////////////////////////
//
// PREFIXES should be listed in order of occurrence.
// That is, 'o' needs to precede 'ni' & 'ti'; 
// and 'ni' & 'ti' must precede 'nech' & 'mitz', etc.
//
// NOTE1: Variety('v') abbreviations: 
//   I = IDIEZ Eastern Huastecan Nahuatl (EHN)
//   Z = Zongolica
//   T = Tenochtitlan 'Classical' Nahuatl
//
// NOTE2: Currently using HASLER instead of ATOMIC
//
// NOTE3: Within each grouping, we must put the *longest* ones
//        first, eg. 'onhaul' before 'on', 'kin' before 'ki' ...
//
//////////////////////////////////////////////////////////////
const prefs = [
// PAST TENSE PREFIX IN Zongolica, Tenochtitlan (Classical), Milpa Alta, and probably other variants:
 { p:'o',d:'PAST'},
// IMPERATIVE:
 { p:'xi',d:'IMPE'},
// VERB SUBJECT PREFIXES:
 { p:'ni',d:'1PSS'},
 { p:'ti',d:'2PSS'},
 { p:'in',d:'2PPS'},
 { p:'nan',d:'2PPS',v:'Z'}, // Zongolica
// VERB OBJECT PREFIXES:
 { p:'nech',d:'1PSO'},
 { p:'mitz',d:'2PSO'},
 { p:'kin',d:'3PPO'},
 { p:'k',d:'3PSO'}, // NB: We now use this one to handle both 'k' and 'ki' cases
 // { p:'ki',d:'3PSO'}, // cannot be preceded by ni/ti/xi; but could have 'o' preceding
 { p:'tech',d:'1PPO'},
 { p:'namech',d:'2PPO',v:'Z'},
 { p:'nimech',d:'2PPO',v:'Z'},
 { p:'amech' ,d:'2PPO',v:'Z'},
 { p:'mech',d:'2PPO'},
// ON & HUAL PROPOSITIVOS:
 { p:'onwal',d:''},
 { p:'wal'  ,d:''},
 { p:'on'   ,d:''},
// MO REFLEXIVE:
 { p:'mo',d:'REFL'},
 { p:'no',d:'REFL',v:'T'} //,
// INDEFINITE OBJECTS: Let's skip these ones for now, as otherwise they gobble up
// things like the 'te' in 'tekiti' and 'tla' in 'tlahtlalia' (Note to self:
// we should probably take advantage of any 'h' following 'tlah' to confirm that the
// 'tlah' is part of a verb in those cases)
 //{ p:'te',d:'3PIO'},
 //{ p:'tla',d:'3TIO'}
];

// Make a set of regexps:
prefs.forEach(entry=>{
  // NB: 'entry' is actually a reference to the
  // entry in the original array, and so we can
  // conveniently add new properties on the entry 
  // as we do here:
  entry.r=new RegExp(`^(${entry.p})([a-z]*)`);
});

/////////////////////////////////////////
//
// SUFFIXES
// 
// NOTE1: The ORDER of these is important
// but note that the algorithm for the
// suffixes works *BACKWARDS* from the
// end of the verb form toward the middle
// of the verb form.
//
/////////////////////////////////////////
const suffs=[
  {s:'sseh'}, // future plural form
  {s:'seh'},  // future plural form
  {s:'kan'},  // plural imperative ending
  {s:'kah'},  // plural imperative ending (NOTE TO SELF: But maybe we just should handle terminal 'n' phonetics ...)
  {s:'keh'},  // preterit plural form
  {s:'h'},     // plural form
  {s:'lo'},   // passive form
  {s:'yaya'},  // imperfect singular form
  {s:'ya'},    // imperfect singular form (Z)
  {s:'yahki'}, // auxiliary verb past tense: -ti-yahqui
  {s:'wallaw'}, // auxiliary verb huallah: -ti-huallah
  {s:'waltok'}, // auxiliary past tense of huallah: -ti-hualtoc
  {s:'wetzi'},  // auxiliary verb wetzi: -ti-huetzi
  {s:'wetzkeh'}, // auxiliary past tense of huetzki: -ti-huetzqueh
  {s:'wetzki'}, // auxiliary past tense of huetzki: -ti-huetzqui
  {s:'nemi'},   // auxiliary verb nemi:    -ti-nemi 
  {s:'kisa'},   // auxiliary verb kisa: -ti-quiza
  {s:'kiskeh'},   // auxiliary past tense kisa: -ti-quizqueh
  {s:'kiski'},   // auxiliary past tense kisa: -ti-quizqui
  {s:'ewa'},    // auxiliary verb ewa: -ti-ehua
  {s:'skia'},  // conditional singular form
  {s:'ti'},    // future propositivo 'to'ward (ir)
  {s:'to'},    // past propositivo 'to'ward (ir)
  {s:'tiw'},   // = -tiuh 'ti'+ 'yauh' (to go)
  {s:'ssa'},   // future 's' + 'ya' = 'ssa'
  {s:'sa'},    // future 's' + 'ya' = 'ssa'
  {s:'ki'},   // future propositivo 'c'ome (venir)
  {s:'ko'},   // past propositivo 'c'ome (venir)
  {s:'k'},    // preterit singular form
  {s:'s'},    // future singular form
  {s:'toya'}, //
  {s:'tika'},
];
// Make a set of regexps:
suffs.forEach(entry=>{
  // NB: 'entry' is actually a reference to the
  // entry in the original array, and so we can
  // conveniently add new properties on the entry 
  // as we do here:
  entry.r=new RegExp(`([a-z]*)(${entry.s})$`);
});

//console.log(prefs);
//return;

// 
// { p:'',d:''},
// { p:'',d:''},

/////////////////////////////
//
// TEST:
//
/////////////////////////////
function test(verbForm){
  const marker='•';
  let result='';
  let remainder=verbForm;
  let precededByNiTiXi = false;

  ////////////////////////
  //
  // PART I: PREFIXES
  //
  ////////////////////////
  for(let i=0;i<prefs.length;i++){
    let matched = remainder.match(prefs[i].r);
    if(matched){
      // SPECIAL CASE FOR 'k' AND 'ki':
      if(matched[1]==='k'){
        if(precededByNiTiXi){
          // FIRST AND SECOND PERSON FORMS:
          // Easy case because we can only have 'k' here:
          // Any vowel following the 'k' is part of the verb:
          result += 'k' + marker;
        }else{
          // THIRD PERSON FORMS:
          // Difficult because 3rd person sg is 'ki'
          // but verb may start with vowel i too:
          result += 'ki' + marker;
          if(matched[2][0]==='i'){
            if(matched[2][1]!='h'){
              // 'h' can only be a terminal consonant, so
              // we know for sure the verb starts with 'i'
              // if followed by 'h'. No change to the remainder.
              //
              // But here we *don't* have an 'h'
              // so it is more complicated. Sometimes
              // we need to peel off the 'i' on the 
              // remainder, and sometimes not:
              // 
              // Cases where we would keep the 'i'
              // as part of the verb stem include:
              //  'itt(a)' , 'itz' , 'ix', etc.:
              if(!matched[2].match(iVerbRegex)){
                matched[2] = matched[2].substring(1);
              }
            }
          }
        }
      }else{
        // NOT the 'k' case, so:
        result += matched[1] + marker;
      }
      // Store the fact that the verb is not in
      // 3rd person:
      if(matched[1].match(/ni|ti|xi/)){
        precededByNiTiXi=true;
      }
      // 'peel' off the prefix from what is left:
      // and save it:
      remainder = matched[2];
    }
  }
  //////////////////////////
  //
  // PART II: SUFFIXES:
  //
  //////////////////////////
  let tail = '';
  for(let i=0;i<suffs.length;i++){
    let matched = remainder.match(suffs[i].r);
    if(matched){
      remainder = matched[1];
      tail = marker + matched[2] + tail;
    }
  }
  //return {prefs:result,remainder:remainder,suffs:tail};
  return `${result}${remainder}${tail}`;
}

///////////////////////////////
//
// MAIN
//
///////////////////////////////
const parsedForm = test(verbForm);
console.log(`${verbForm}\t${parsedForm}`);


