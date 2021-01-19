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
// the algorithm with the lists of verbs or
// verb stems to look out for.
//
// NOTA BENE: IN THIS FILE WE ARE
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
// vs_xx tables are used when looking for
// prefixes. vs_xx tables are used when 
// looking for suffixes.
//
///////////////////////////////////////////

const vstem={
 stt:{
   ax:[
     'axix',
     'axkati',
     'axoxokti',
     'axoxowi'
   ],
   o:[
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
   ],
   ni:[
     'niτκa' // maybe never used without tlan- prefix?
   ],
   xi:[
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
   ],
   ti:[
     'tiamiki',
     'tiankiso',
     'tihtilan',
     'tihtis',
     'tihtixili',
     'tilakti',
     'tilana',
     'tilanili',
     'tilanki',
     'tilawa',
     'tilawi',
     'tilawki',
     'tilikti',
     'tilini',
     'tilinki',
     'tioλaki',
     'tioςiw',
     'tisi',
     'tiski',
     'titika',
     'titili',
     'titiτa',
     'titiκika',
     'titiτ',
     'tixili',
     'tixnamik',
     'tixnamik',
     'tixwak',
     'tixwak',
     'tiλan',
     'tiκin'
   ],
   in:[
     'inama',
     'inanki'
   ],
   nan:[
     'nanalka',
     'nanamak',
     'nanamik',
     'nanankili',
     'nankili'
   ],
   neς:[
     'neςik',
     'neςkawi'
   ],
   miτ:[ // no entries found
   ],
   ki:[
     'kihki',
     'kikis',
     'kikixili',
     'kimil',
     'kisa',
     'kiski',
     'kixkix',
     'kixti'
   ],
   i:[
     
   ],
   teς:[
     'teςankalak',
     'teςti'
   ],
   meς:[ // no entries found
   ],
   ameς:[ // no entries found
   ],
   nameς:[ // no entries found
   ],
   nimeς:[ // no entries found
   ],
   kin:[ // no entries found
   ],
   on:[
     'oni',
     'onka'
   ],
   wal:[
     'walani',
     'walla',
     'walki',
     'wallik'
   ],
   onwal:[ // no entries found
   ],
   mo:[
     'mohmol',
     'mohmoyaw',
     'mohmoτki',
     'mohκeni',
     'mola',
     'molekti',
     'molew',
     'molini',
     'molki',
     'moloni',
     'molonki',
     'molwili',
     'molwilki',
     'momohκeni',
     'momoloka',
     'momoloni',
     'momolonki',
     'momoloτa',
     'momoloτki',
     'momonti',
     'momoτiwi',
     'momoτki',
     'momoτo',
     'momoτwili',
     'momoτwilki',
     'monti',
     'monton',
     'moskalti',
     'mosko',
     'moxix',
     'moyanκili',
     'moyanκilki',
     'moyaw',
     'moyawi',
     'moyawki',
     'moλa',
     'moτiwi',
     'moκiλaw',
     'moτki',
     'moτo',
     'moτti'
   ],
   no:[
     'nohnoτ',
     'nokixki',
     'nokiya',
     'nonoti',
     'nonoτ',
     'noτa',
     'noτki',
   ],
   te:[
     'teh',
     'teiski',
     'teka',
     'tekelti',
     'tekeresti',
     'tekeτ',
     'tekeς',
     'teki',
     'tekkakti',
     'tekki',
     'tekoloti',
     'tekowi',
     'tekpan',
     'tekpiς',
     'teksis',
     'teleksa',
     'telolohti',
     'telpokati',
     'tema',
     'temah',
     'temaka',
     'temal',
     'temaςi',
     'temi',
     'temo',
     'tempalan',
     'tempano',
     'tempaς',
     'tempeliw',
     'tempeλan',
     'tempeς',
     'tempipiτ',
     'tempohpow',
     'tempol',
     'temposon',
     'tenahwayow',
     'tenahwayowki',
     'tenak',
     'tenki',
     'tenanλasλa',
     'tenatemo',
     'tenayotemo',
     'teneti',
     'tenex',
     'tenihyal',
     'tenilakaτiw',
     'tenilakaτ',
     'tenilpi',
     'tenistakkisa',
     'tenixmelaw',
     'tenk',
     'tenm',
     'tenn',
     'tenolςo',
     'tent',
     'tenw',
     'tenx',
     'teny',
     'tenκ',
     'tenλ',
     'tenτ',
     'tenκ',
     'tenς',
     'tepalkaw',
     'tepalkaya',
     'tepaniwi',
     'tepano',
     'tepaςo',
     'tepeka',
     'tepew',
     'tepexiw',
     'tepeλati',
     'tepoλami',
     'tepoτtok',
     'tesaka',
     'tesi',
     'teskati',
     'teskiti',
     'tetahkis',
     'tetahλasλa',
     'tetek',
     'tetekpiςo',
     'tetelti',
     'tetema',
     'tetem',
     'tetenki',
     'tetenti',
     'tetenyoti',
     'tetepew',
     'tetepoτtoka',
     'tetexiwi',
     'tetexo',
     'teteςiwi',
     'teteτiw',
     'teteςo',
     'teteτ',
     'tetili',
     'tetioςiw',
     'tetixki',
     'tetiya',
     'tetoni',
     'tewi',
     'teyotik',
     'teτakti',
     'teλanankili',
     'teλanewia',
     'teςankalak',
     'teτawa',
     'teτawi',
     'teτililpi',
     'teτiliwi',
     'teκiliςti',
     'teτil',
     'teτonkalyamanil',
     'teςti',
   ],
   λa:[
   ]

 },
 end:{

 }
};

//console.log(vstem.stt['o']);

