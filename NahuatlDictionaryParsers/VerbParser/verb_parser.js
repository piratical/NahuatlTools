///////////////////////////////////////////////////
//
// verb_parser.js
//
// This is a rough first draft implementation
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

const atom_cons=['m','n','p','t','k','κ','τ','λ','ς','s','l','x','h','y','w'];

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
// 'on' y 'hual'. Also lumping 'yek' in here, not sure if that is OK?:
const prefijos_direcionales     =['on','hual','yek'];
// 'mo' reflexive; I believe 'no' is in classical only:
const prefijos_reflexivos      =['mo','no'];
// direct indefinite object prefixes:
const prefijos_no_definidos    =['tla','te'];
// sufijos_preteritos: 'skiaya','toya','tika' in Zongolica;
// singular and plural forms are included together here:
const sufijos=[
  'h',
  'k','ki','keh',
  's','sseh','seh',
  'yaya','yayah',
  'skia','skiah',
  'kan','kah',
  'kih',
  'ti','tih',
  'ko','koh',
  'to','toh',
  'toya','toyah',
  'tika','tikah',
  'weh','teh'
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
const verbStemPlusSuffixes ='([a-z]+)';
const lr_parts = [
  arrayToRegexOptionGroup(prefijo_preterito),
  arrayToRegexOptionGroup(pronominales_de_subjeto),
  arrayToRegexOptionGroup(pronominales_de_objeto),
  arrayToRegexOptionGroup(prefijos_direcionales),
  arrayToRegexOptionGroup(prefijos_reflexivos),
  arrayToRegexOptionGroup(prefijos_no_definidos),
  verbStemPlusSuffixes
];

const lr_parser_string = lr_parts.join('');
console.log(lr_parser_string);
const lr_parser = new RegExp(lr_parser_string);

const rl_parser_string = reverseArrayToRegexOptionGroup(sufijos);
console.log(rl_parser_string);
const rl_parser = new RegExp(rl_parser_string+'([a-z]+)');

// Test somethings:
function test(verb_form){
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

