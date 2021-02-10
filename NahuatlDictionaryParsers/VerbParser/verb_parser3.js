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
  return new RegExp('^('+arr.join('|')+')');
}

//////////////////////////////////////////////
//
// arrayToEndRegexOptionGroup
//
//////////////////////////////////////////////
function arrayToEndRegexOptionGroup(arr){
  // Sort to longest strings first.
  // Since we are sorting in descending order by
  // length, it seems reasonable to also do
  // the nested alphabetic sort in reverse order too.
  // This nested sort is not critical, but makes it a
  // little bit easier for human eyes:
  arr.sort( (a,b)=>{
    return b.length-a.length || b.localeCompare(a);
  });
  return new RegExp('('+arr.join('|')+')$');
}

////////////////////////////////////////////
//
// keyToStartRegex
//
////////////////////////////////////////////
function keyToStartRegex(key){
  return new RegExp(`^(${key})(.*)`);
}

////////////////////////////////////////////
//
// keyToEndRegex
//
////////////////////////////////////////////
function keyToEndRegex(key){
  return new RegExp(`(.*)(${key})$`);
}

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
 stt:[
   {
     key:'ax',
     include:keyToStartRegex('ax'),
     exclude:arrayToRegexOptionGroup([
       'axix',
       'axkati',
       'axoxokti',
       'axoxowi'
     ])
   },
   {
     key:'o',
     include:keyToStartRegex('o'),
     exclude:arrayToRegexOptionGroup([
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
     ])
   },
   {
     key:'ni',
     include:keyToStartRegex('ni'),
     exclude:arrayToRegexOptionGroup([
       'niτκa' // maybe never used without tlan- prefix?
     ])
   },
   {
     key:'xi',
     include:keyToStartRegex('xi'),
     exclude:arrayToRegexOptionGroup([
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
     ])
   },
   {
     key:'ti',
     include:keyToStartRegex('ti'),
     exclude:arrayToRegexOptionGroup([
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
     ])
   },
   {
     key:'in',
     include:keyToStartRegex('in'),
     exclude:arrayToRegexOptionGroup([
     'inama',
     'inanki'
     ])
   },
   {
     key:'nan',
     include:keyToStartRegex('nan'),
     exclude:arrayToRegexOptionGroup([
     'nanalka',
     'nanamak',
     'nanamik',
     'nanankili',
     'nankili'
     ])
   },
   {
     key:'neς',
     include:keyToStartRegex('neς'),
     exclude:arrayToRegexOptionGroup([
     'neςik',
     'neςkawi'
     ])
   },
   {
     key:'miτ',
     include:keyToStartRegex('miτ'),
     exclude:0
   },
   // NB: kin MUST PRECEDE ki:
   {
     key:'kin',
     include:keyToStartRegex('kin'),
     exclude:0
   },
   {
     key:'ki',
     include:keyToStartRegex('ki'),
     exclude:arrayToRegexOptionGroup([
     'kihki',
     'kikis',
     'kikixili',
     'kimil',
     'kisa',
     'kiski',
     'kixkix',
     'kixti'
     ])
   },
   // SPECIAL CASE WITH k:
   {
     key:'k',
     include:keyToStartRegex('k'),
     exclude:arrayToRegexOptionGroup([
       'kafe',
       'kahka',
       'kal',
       'koς',
       'kow',
       'koxon',
       'kohko',
       'koko',
       'kimil',
       'komal',
       'kone',
       'koxtal',
       'kak',
       'koy',
       'koτ',
       'kisa',
       'kixt',
       'keς',
       '',
     ])
   },
   //{
   //  // NOTE TO SELF: CHECK THIS ONE:
   //  key:'i',
   //  include:keyToStartRegex('i'),
   //  exclude:arrayToRegexOptionGroup([
   //  'ih',
   //  'ikxi',
   //  'ix'
   //  ])
   //},
   {
     key:'teς',
     include:keyToStartRegex('teς'),
     exclude:arrayToRegexOptionGroup([
     'teςankalak',
     'teςti'
     ])
   },
   {
     key:'meς',
     include:keyToStartRegex('meς'),
     exclude:0
   },
   {
     key:'ameς',
     include:keyToStartRegex('ameς'),
     exclude:0
   },
   {
     key:'nameς',
     include:keyToStartRegex('nameς'),
     exclude:0
   },
   {
     key:'nimeς',
     include:keyToStartRegex('nimeς'),
     exclude:0
   },
   {
     key:'onwal',
     include:keyToStartRegex('onwal'),
     exclude:0
   },
   {
     key:'on',
     include:keyToStartRegex('on'),
     exclude:arrayToRegexOptionGroup([
     'oni',
     'onka'
     ])
   },
   {
     key:'wal',
     include:keyToStartRegex('wal'),
     exclude:arrayToRegexOptionGroup([
     'walani',
     'walla',
     'walki',
     'wallik'
     ])
   },
   {
     key:'mo',
     include:keyToStartRegex('mo'),
     exclude:arrayToRegexOptionGroup([
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
     ])
   },
   {
     key:'no',
     include:/^(no)(.*)/,
     exclude:arrayToRegexOptionGroup([
     'nohnoτ',
     'nokixki',
     'nokiya',
     'nonoti',
     'nonoτ',
     'noτa',
     'noτki',
     ])
   },
   {
     key:'te',
     include:/^(te)(.*)/,
     exclude:arrayToRegexOptionGroup([
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
     ])
   },
   {
     key:'λa',
     include:/^(λa)(.*)/,
     exclude:arrayToRegexOptionGroup([
     // any occurrences of λa followed by a terminal consonant 
     // then followed by another consonant are clearly not the 
     // 'λa' indefinite direct object:
     'λahk',
     'λahm',
     'λahp',
     'λaht',
     'λahκ',
     'λahλ',
     'λahς',
     'λahτ',
     'λakp',
     'λakx',
     'λalk',
     'λall',
     'λalm',
     'λalp',
     'λals',
     'λalt',
     'λalw',
     'λalx',
     'λalς',
     'λalτ',
     'λamp',
     'λank',
     'λann',
     'λanr',
     'λany',
     'λanκ',
     'λanλ',
     'λask',
     'λast',
     'λasλ',
     'λawt',
     'λaxk',
     'λaxx',
     'λaxλ',
     'λaτk',
     'λaςp',
     'λaςκ',
     'λaςς',
     // Any instance of 'λah' followed by a vowel would also
     // not be 'λa' indefinite object, but no such records were found.
     // ... still there are over 900 more that need to be looked at :(
    'λaahkoκili',
    'λaahsi',
    'λaahsilti',
    'λaahwa',
    'λaahweς',
    'λaahwi',
    'λaakakawaka',
    'λaakalak',
    'λaakis',
    'λaakomoliwi',
    'λaalawa',
    'λaalawi',
    'λaalax',
    'λaalti',
    'λaaltia',
    'λaamani',
    'λaamat',
    'λaame',
    'λaaohti',
    'λaapiliw',
    'λaapismik',
    'λaapolon',
    'λaapopoteka',
    'λaatemi',
    'λaaweτ',
    'λaaxixil',
    'λaayawki',
    'λaayotemok',
    'λaayowi',
    'λaayoςiςipik',
    'λaayoςoςopik',
    'λaaκa',
    'λaaςakani',
    'λaaςipin',
    'λaaςiςipik',
    'λaaςoti',
    'λaehe',
    'λaekawi',
    'λael',
    'λaespolo',
    'λaew',
    'λaeςkapaniw',
    'λafierohςiw',
    'λafierohςiwki',
    'λaihi',
    'λaihihto',
    'λaihihκen',
    'λaihsoλalmihyoti',
    'λaihtiκaκalaka',
    'λaihto',
    'λaihyo',
    'λaihλakaw',
    'λaihτeliw',
    'λaihκenil',
    'λaiihihκeni',
    'λaikxipani',
    'λailwikis',
    'λailwiςiwki',
    'λaitonal',
    'λaiwinti',
    'λaixkokopeka',
    'λaixmanil',
    'λaixnamik',
    'λaixpano',
    'λaixpaςiwi',
    'λaixpi',
    'λaixpol',
    'λaixsese',
    'λaixwa',
    'λaixwitekil',
    'λaixκapil',
    'λaixλapowi',
    'λaixςaςapalti',
    'λaixκeκemoka',
    'λaiκsi',
    'λaiςtekil',
    'λakahka',
    'λakakalakak',
    'λakakalaςko',
    'λakakaliwki',
    'λakakawatik',
    'λakakaxakak',
    'λakakaτ',
    'λakakaρontik',
    'λakakaτλi',
    'λakaki',
    'λakakkeτin',
    'λakakki',
    'λakalan',
    'λakampoτ',
    'λakana',
    'λakanaw',
    'λakat',
    'λakawa',
    'λakawi',
    'λakayokoko',
    'λakayonamik',
    'λakayotemo',
    'λakayotetixki',
    'λakayoκahκalo',
    'λakaρerahwi',
    'λaken',
    'λakeτ',
    'λakeτa',
    'λakeςi',
    'λaki',
    'λakihkixtil',
    'λakikis',
    'λakixti',
    'λako',
    'λakohko',
    'λakokotoka',
    'λakokoxoka',
    'λakomiςiw',
    'λakomoliw',
    'λakomolςiw',
    'λakopew',
    'λakosiwi',
    'λakoswi',
    'λakoton',
    'λakowi',
    'λakoyon',
    'λakoςmik',
    'λakoςwawataka',
    'λakoςweτ',
    'λalana',
    'λalanil',
    'λalanki',
    'λaleκeni',
    'λali',
    'λalia',
    'λalki',
    'λalo',
    'λaloςoni',
    'λaloςti',
    'λamahkaw',
    'λamahmani',
    'λamahmawtil',
    'λamahmaκil',
    'λamahκi',
    'λamahκilti',
    'λamaka',
    'λamalini',
    'λamama',
    'λamamalti',
    'λaman',
    'λamanoτ',
    'λamanteil',
    'λamantiil',
    'λamanyanti',
    'λamapaςiw',
    'λamapostek',
    'λamat',
    'λamawiso',
    'λamayaw',
    'λamayow',
    'λamaςi',
    'λamaτi',
    'λamaςti',
    'λame',
    'λami',
    'λamih',
    'λamiitta',
    'λamiixahalo',
    'λamiixpikil',
    'λamiko',
    'λamil',
    'λamimil',
    'λamipol',
    'λamisokipol',
    'λamixte',
    'λamiκa',
    'λamiκalil',
    'λamiκi',
    'λamiςti',
    'λamohmole',
    'λamontil',
    'λamoκiλawi',
    'λanahnawati',
    'λanamik',
    'λananankili',
    'λanankil',
    'λanawatil',
    'λanawi',
    'λane',
    'λanehnekil',
    'λanemi',
    'λanempanςiw',
    'λanes',
    'λanew',
    'λanexil',
    'λani',
    'λanoki',
    'λaohonkah',
    'λaolin',
    'λaompaka',
    'λaoni',
    'λaonkah',
    'λaowihkanti',
    'λapa',
    'λapahsoliw',
    'λapahti',
    'λapahtil',
    'λapakti',
    'λapalani',
    'λapalti',
    'λapan',
    'λapano',
    'λapansawan',
    'λapantepoτew',
    'λapanwasan',
    'λapapalaka',
    'λaparehohλal',
    'λapaso',
    'λapasol',
    'λapatadahwi',
    'λapatiy',
    'λapaςiwi',
    'λapaτka',
    'λapaςkaτahτi',
    'λapaςo',
    'λapaςolti',
    'λapehpen',
    'λapehpeςti',
    'λapepeλaka',
    'λapepeλaτa',
    'λapeλan',
    'λapihpi',
    'λapik',
    'λapili',
    'λapipilika',
    'λapipilolwi',
    'λapipiςika',
    'λapipiτika',
    'λapiτa',
    'λapiτawa',
    'λapiτawkaweτ',
    'λapiτawki',
    'λapiςin',
    'λapiτki',
    'λapo',
    'λapolki',
    'λapolo',
    'λapololti',
    'λapopoka',
    'λapopolwi',
    'λapopoteka',
    'λapotewi',
    'λapoteya',
    'λapow',
    'λapoyeltil',
    'λapoyew',
    'λasasaw',
    'λasawan',
    'λasawat',
    'λasehseltik',
    'λaseli',
    'λasemmaniwki',
    'λaseselilli',
    'λaseseski',
    'λasew',
    'λaseweτ',
    'λasiw',
    'λaso',
    'λasohmat',
    'λasohso',
    'λasokwi',
    'λasolte',
    'λasolλa',
    'λatehtek',
    'λatehteka',
    'λatehtemil',
    'λateil',
    'λateki',
    'λatelwi',
    'λatema',
    'λatemi',
    'λaten',
    'λatepew',
    'λatewi',
    'λati',
    'λatihtilan',
    'λatil',
    'λatilana',
    'λatiti',
    'λatixil',
    'λatiλan',
    'λatoki',
    'λatokilti',
    'λatolew',
    'λatololtil',
    'λatolowa',
    'λatomon',
    'λatopon',
    'λatotoni',
    'λatoxom',
    'λatoxon',
    'λawak',
    'λawakeheka',
    'λawapan',
    'λawasani',
    'λawawani',
    'λawawasaka',
    'λaweli',
    'λawelilo',
    'λawelkawa',
    'λawelmat',
    'λawelon',
    'λawelςiw',
    'λawexkantiya',
    'λawexςiw',
    'λawexςiwk',
    'λaweτka',
    'λawi',
    'λawihwikil',
    'λawika',
    'λawikil',
    'λawisi',
    'λawiso',
    'λawitek',
    'λawiwiρika',
    'λawiyon',
    'λawiρin',
    'λaxa',
    'λaxaman',
    'λaxawan',
    'λaxi',
    'λaxika',
    'λaxiko',
    'λaxilokisa',
    'λaxipe',
    'λaxipew',
    'λaxitin',
    'λaxiwimahmaκi',
    'λaxiwimaκi',
    'λaxiwiyoli',
    'λaxolon',
    'λayamani',
    'λayawal',
    'λayayawi',
    'λayehyekalwi',
    'λayekana',
    'λayekanki',
    'λayekkanti',
    'λayi',
    'λayo',
    'λayol',
    'λayowa',
    'λayowi',
    'λaκa',
    'λaλa',
    'λaλael',
    'λaλahλan',
    'λaλak',
    'λaλalan',
    'λaςalan',
    'λaλali',
    'λaκalkanwi',
    'λaλalki',
    'λaκalnamak',
    'λaκalo',
    'λaλalo',
    'λaκalok',
    'λaκaltek',
    'λaκalti',
    'λaκaltiya',
    'λaκalλam',
    'λaκalλan',
    'λaκalςi',
    'λaκalςihςi',
    'λaκalςiw',
    'λaλaman',
    'λaλamana',
    'λaςamana',
    'λaςamanki',
    'λaλami',
    'λaλanes',
    'λaλanki',
    'λaλapaka',
    'λaλapaτ',
    'λaλapo',
    'λaλas',
    'λaκawi',
    'λaλawi',
    'λaλawti',
    'λaλaxika',
    'λaλaxkalo',
    'λaλayo',
    'λaλaκa',
    'λaκaτahτi',
    'λaλaκalti',
    'λaςaςamaka',
    'λaςaςapaltik',
    'λaςaςawatik',
    'λaλaκeςti',
    'λaλaτika',
    'λaλaτilini',
    'λaλaτki',
    'λaλehko',
    'λaκepon',
    'λaκesiwi',
    'λaκeς',
    'λaκeκepoka',
    'λaκeκeyoka',
    'λaκeκeςaka',
    'λaκeκeςeka',
    'λaςi',
    'λaτi',
    'λaκihκil',
    'λaςikawak',
    'λaςikawi',
    'λaςikiliw',
    'λaτikipilki',
    'λaτikipilo',
    'λaςikokiski',
    'λaςikoltik',
    'λaςikotik',
    'λaςil',
    'λaςili',
    'λaτilin',
    'λaςilki',
    'λaτini',
    'λaτinki',
    'λaςino',
    'λaτinλayowa',
    'λaςipawi',
    'λaςipin',
    'λaτiwi',
    'λaτiwki',
    'λaςixki',
    'λaςiya',
    'λaςiyaw',
    'λaςiκeni',
    'λaτiτika',
    'λaςiςil',
    'λaςiςin',
    'λaτontekili',
    'λaτoyonil',
    'λaςoςopika'
    ])
  }
 ],
 end:[
  {
   key:'sseh', //future plural form
   include:keyToEndRegex('sseh'),
   exclude:0
  },
  {
   key:'seh', //future plural form
   include:keyToEndRegex('seh'),
   exclude:0
  },
  {
   key:'kan', //plural imperative ending
   include:keyToEndRegex('kan'),
   exclude:0
  },
  {
   key:'kah', //plural imperative ending (NOTE TO SELF: But maybe we just should handle terminal 'n' phonetics ...)
   include:keyToEndRegex('kah'),
   exclude:arrayToEndRegexOptionGroup([
    'onkah'
   ])
  },
  {
   key:'keh', //preterit plural form
   include:keyToEndRegex('keh'),
   exclude:0
  },
  {
   key:'h', //plural form
   include:keyToEndRegex('h'),
   exclude:arrayToEndRegexOptionGroup([
    'onkah'
   ])
  },
  {
   key:'lo', //passive form
   include:keyToEndRegex('lo'),
   exclude:arrayToRegexOptionGroup([
    'κalo',
    'wilo',
    'tilo',
    'lilo'
   ])
  },
  {
   key:'yaya', //imperfect singular form
   include:keyToEndRegex('yaya'),
   exclude:arrayToEndRegexOptionGroup([
    'kahyaya',
    'ihyaya'
   ])
  },
  // NOTE TO SELF: CHECK THIS ONE CAREFULLY AGAIN:
  {
   key:'ya', //imperfect singular form (Z)
   include:keyToEndRegex('ya'),
   exclude:arrayToEndRegexOptionGroup([
    'aya',
    'eya',
    'iya',
    'oya',
   ])
  },
  {
   key:'yahki', //auxiliary verb past tense: -ti-yahqui
   include:keyToEndRegex('yahki'),
   exclude:0
  },
  {
   key:'wallaw', //auxiliary verb huallah: -ti-huallah
   include:keyToEndRegex('wallaw'),
   exclude:0
  },
  {
   key:'waltok', //auxiliary past tense of huallah: -ti-hualtoc
   include:keyToEndRegex('waltok'),
   exclude:0
  },
  {
   key:'wetzi', //auxiliary verb wetzi: -ti-huetzi
   include:keyToEndRegex('wetzi'),
   exclude:0
  },
  {
   key:'wetzkeh', //auxiliary past tense of huetzki: -ti-huetzqueh
   include:keyToEndRegex('wetzkeh'),
   exclude:0
  },
  {
   key:'wetzki', //auxiliary past tense of huetzki: -ti-huetzqui
   include:keyToEndRegex('wetzki'),
   exclude:0
  },
  {
   key:'nemi', //auxiliary verb nemi:    -ti-nemi 
   include:keyToEndRegex('nemi'),
   exclude:arrayToEndRegexOptionGroup([
    'nehnemi'
   ])
  },
  // NOTE TO SELF: CHECK AGAIN
  {
   key:'kisa', //auxiliary verb kisa: -ti-quiza
   include:keyToEndRegex('kisa'),
   exclude:0
  },
  {
   key:'kiskeh', //auxiliary past tense kisa: -ti-quizqueh
   include:keyToEndRegex('kiskeh'),
   exclude:0
  },
  {
   key:'kiski', //auxiliary past tense kisa: -ti-quizqui
   include:keyToEndRegex('kiski'),
   exclude:0
  },
  // NOTE TO SELF: CHECK AGAIN:
  {
   key:'ewa', //auxiliary verb ewa: -ti-ehua
   include:keyToEndRegex('ewa'),
   exclude:0
  },
  {
   key:'skia', //conditional singular form
   include:keyToEndRegex('skia'),
   exclude:0
  },
  {
   key:'ti', //future propositivo 'to'ward (ir)
   include:keyToEndRegex('ti'),
   exclude:arrayToEndRegexOptionGroup([
    'mati',
    'tekiti'
   ])
  },
  {
   key:'to', //past propositivo 'to'ward (ir)
   include:keyToEndRegex('to'),
   exclude:0
  },
  {
   key:'tiw', //= -tiuh 'ti'+ 'yauh' (to go)
   include:keyToEndRegex('tiw'),
   exclude:0
  },
  {
   key:'ssa', //future 's' + 'ya' = 'ssa'
   include:keyToEndRegex('ssa'),
   exclude:0
  },
  {
   key:'sa', //future 's' + 'ya' = 'ssa'
   include:keyToEndRegex('sa'),
   exclude:0
  },
  {
   key:'ki', //future propositivo 'c'ome (venir)
   include:keyToEndRegex('ki'),
   exclude:arrayToEndRegexOptionGroup([
    'ahki',
    'aki',
    'iτki',
    'kaki',
    'kalaki',
    'miki',
    'neki',
    'paki',
    'paτki',
    'piki',
    'pixki',
    'poτaki',
    'saki',
    'teki',
    'waki',
    'λaki'
   ])
  },
  {
   key:'ko', //past propositivo 'c'ome (venir)
   include:keyToEndRegex('ko'),
   exclude:0
  },
  {
   key:'k', //preterit singular form
   include:keyToEndRegex('k'),
   exclude:0
  },
  {
   key:'s', //future singular form
   include:keyToEndRegex('s'),
   exclude:0
  },
  {
   key:'toya', //
   include:keyToEndRegex('toya'),
   exclude:0
  },
  {
   key:'tika', //
   include:keyToEndRegex('tika'),
   exclude:0
  }
 ]
};

/////////////////////////////
//
// SEGMENT:
//
/////////////////////////////
function segment(verbForm){
  const marker='•';
  let result='';
  let remainder=verbForm;
  let precededByNiTiXi = false;

  ////////////////////////
  //
  // PART I: PREFIXES
  //
  ////////////////////////
  vstem.stt.forEach(obj=>{
    let excluded = remainder.match(obj.exclude);
    let matched  = remainder.match(obj.include);
    if(matched && !excluded){
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
              // // if(!matched[2].match(iVerbRegex)){
              // //  matched[2] = matched[2].substring(1);
              // //}
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
    // -- ++ --
    }
  });
  // SUFFIXES (NOT COMPLETE YET)
  let tail = '';
  vstem.end.forEach(obj=>{
    let excluded = remainder.match(obj.exclude);
    let matched  = remainder.match(obj.include);
    if(matched && !excluded){
        remainder = matched[1]
        tail = marker + matched[2] + tail;
    }
  });

  // RETURN:
  return `${result}\u001b[35m${remainder}\u001b[0m${tail}`;
}

///////////////////////////////
//
// MAIN
//
///////////////////////////////
if(process.argv.length!=3){
  console.error('Please specify a verb form to test on the command line');
  return 1;
}

// The verb form to process:
const verbForm = process.argv[2];
const result = segment(verbForm);
console.log(result);

