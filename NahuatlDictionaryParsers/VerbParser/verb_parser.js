///////////////////////////////////////////////////
//
// verb_parser.js
//
// This is a work-in-progress implementation
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
const test_form = process.argv[2];


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
// NB2:  We add '?' indicating "zero or one occurrence"
//       at the end of the parenthesized group.
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
  return '('+arr.join('|')+')?';
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
///////////////////////////
//
// MORFOLOGÍA DEL VERBO
//
///////////////////////////

// 'o' prefix used for preterit in Zongolica, Milpa Alta (Malacatepec), Tenochtitlan (Classical);
// not used, to my knowledge, in Chicon:
const prefijo_preterito       = ['o','yo'];
// 'nan' in Zongolican variants, 'in' in Chicontepec variants:
// 'xi' for the imperative: I think this can be lumped in here:
const pronominales_de_subjeto =['ni','ti','in','nan','xi'];
// 'mech' in Chicon; 'namech' in Zongolica:
const pronominales_de_objeto  =['nech','mitz','k','ki','tech','mech','kin','namech'];
// 'on' y 'hual'. Also note that 'on' can be used in the 'immediacy' sense 
// even with 'hual' present, hence 'onhual':
//Also lumping 'yek' in here, not sure if that is OK?: 
const prefijos_direcionales     =['on','hual','onhual','yek'];
// 'mo' reflexive; I believe 'no' is in classical only:
const prefijos_reflexivos      =['mo','no'];
// direct indefinite object prefixes:
const prefijos_no_definidos    =['tla','te'];
// sufijos_preteritos: 'skiaya','toya','tika' in Zongolica;
// singular and plural forms are included together here:
const sufijos=[
  // plural suffix:
  'h',
  // preterit forms:
  'k','ki','kih','keh',
  // future forms:
  's','sseh','seh',
  // EHN imperfect forms:
  'yaya','yayah',
  // 
  'skia','skiah',
  // plural suffixes with imperitive 'xi':
  'kan','kah',
  // directionals going away 'to'ward someplace:
  'ti','tih',
  'to','toh',
  'toya','toyah',
  // directionals 'co'ming here ('ki' and 'kih' already seen above): 
  'ko','koh',
  //
  'tika','tikah',
  //
  'weh','teh',
  // future + immediate particle 'ya', sg. & plural:
  'sa','ssa','sah','ssah',
  // passive forms:
  'lo','loh'
];

// VERB PARTS:

///////////////////////////////////////////////////////////////////////////////
//
// verbStem may actually itself be a compound of several things 
// e.g.: - 'kualchiwa' => 'kualli' + 'chiwa'
//       - 'ihtosneki' => 'ihtoa'  + 'neki'
//       - etc.
//
// For now, we are not going to try to break those out at all. We just 
// hope that there already exist entries in the database for those compounds.
//
///////////////////////////////////////////////////////////////////////////////

const leftSide = [
  arrayToRegexOptionGroup(prefijo_preterito),
  arrayToRegexOptionGroup(pronominales_de_subjeto),
  arrayToRegexOptionGroup(pronominales_de_objeto),
  arrayToRegexOptionGroup(prefijos_direcionales),
  arrayToRegexOptionGroup(prefijos_reflexivos),
  arrayToRegexOptionGroup(prefijos_no_definidos),
  generalPatternString
];

const leftSideString = leftSide.join('');
const leftSideParser = new RegExp(leftSideString);

const rightSideString = reverseArrayToRegexOptionGroup(sufijos);
const rightSideParser = new RegExp( rightSideString + generalPatternString );

const middleString = arrayToRegexOptionGroup(verbList);
const middleParser = new RegExp( generalPatternString + middleString + generalPatternString );
//const middleParser = new RegExp( middleString );

console.log('=== VERB OPTIONS ====');
console.log(middleString);
console.log('=== PREFIXES: ===');
console.log(leftSideString);
console.log('=== SUFFIXES: ===');
console.log(rightSideString);

function test(verbForm){
  const prefixes = verbForm.match(leftSideParser);
  console.log(prefixes);
  const remainder = prefixes[7];
  console.log(remainder);
  const splits = remainder.match(middleParser);
  console.log(splits);
}

// oldTest somethings:
function old_test(verb_form){
  const result1 = verb_form.match(lr_parser);
  console.log('R1:');
  console.log(result1);
  console.log('R2:');
  const result2 = result1[7];
  console.log(result2);
  const result2reversed = reverse(result2);
  console.log('R2 reversed:');
  console.log(result2reversed);
  const result3 = result2reversed.match(rl_parser);
  console.log('R3:');
  console.log(result3);
  const result4 = reverse(result3[2]);
  console.log('R4:');
  console.log(result4);
}

console.log('===========');
test(test_form);

