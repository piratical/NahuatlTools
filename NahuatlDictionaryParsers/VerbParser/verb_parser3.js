///////////////////////////////////////////
//
// verb_parser3.js
//
// © 2021 by Edward H. Trager
// ALL RIGHTS RESERVED
//
///////////////////////////////////////////

///////////////////////////////////////////
//
// INTRODUCTION
// ============
//
// The general idea is that we "peel off"
// prefixes and then suffixes, eventually
// leaving just the verb stem. The verb
// stem will normally be in present form
// or preterit form. There may be a few
// pluperfect forms too.
//
// The sequence order in which prefixes
// and suffixes occur is known. However
// the difficult part is that we cannot,
// for example, peel off an initial "ax"
// as a negativizing prefix *if* the verb
// stem itself happens to start with "ax"
// (as is the case with "axixa"). Likewise,
// we cannot peel of "te" if the verb stem
// itself is "te" (as in teki). There are
// numerous cases like this. As humans, we
// know what the words are, so we can pick
// out the verb stems from our stored knowledge
// of the verbs. But the computer doesn't
// know the verb stems. So we have to supply
// the algorithm with the lists of verbs to
// look out for.
//
// NOTA BENE: In this file we are ONLY
// USING THE ATOMIC ORTHOGRAPHY
//
///////////////////////////////////////////

///////////////////////////////////////////
//
// SECTION I : PREFIXES
//
///////////////////////////////////////////
//
// verb tables: 
//   vs_xx : verb (stem) starting with xx
//   ve_yy : verb (stem) ending with yy
//
///////////////////////////////////////////
const vs_ax=[
 'axix',
 'axkati',
 'axoxokti',
 'axoxowi',
];

const vs_o=[
 'oh',
 'okiς',
 'okti',
 'olin',
 'olol',
 'olςo',
 'omewi',
 'omiyo',
 'ompaka',
 'ompan',
 'ompaya',
 'ompowi',
 'oni',
 'onka',
 'ooni',
 'ooxki',
 'ooya',
 'ooyil',
 'ostokti',
 'owia',
 'owih',
 'oxki',
 'oya',
 'oyi',
 'oyil',
 'oκil',
 'oςpan',
 'oτti'
];

const vs_ni=[
 'niτκa' // maybe never used without tlan- prefix?
];

const vs_xi=[
 'xihx',
 'xikalti',
 'xikanti',
 'xikiwi',
 'xiko',
 'xilwi',
 'xima',
 'ximi',
 'xinehpal',
 'xinepal',
 'xinki',
 'xipew',
 'xitini',
 'xitom',
 'xiton',
 'xiwimaκi',
 'xiwi',
 'xiwλam',
 'xiwλan',
 'xixa',
 'xixi',
 'xixki',
 'xiya',
 'xiλakti',
 'xiλan',
 'xiλaw',
 'xiκeni',
 'xiκenki'
];


