/////////////////////////////////////
//
// respell.js
//
/////////////////////////////////////

//////////////////////////////////////
//
// acheToElle
//
// in Hasler and "intuitive" modern
// orthographies, "illia" with geminated
// elle is very frequently spelled "ihlia"
// based on the phonetics of the 
// pronounciation. Here we just map
// those common cases back to the 
// geminated 'll' spellings:
//
//////////////////////////////////////
const acheToElle = {
 'ahkohleκenia':'ahkolleκenia',
 'iihlamiki':'iillamiki',
 'ihlamiki':'illamiki',
 'ihlamikilia':'illamikilia',
 'ihlamikiltia':'illamikiltia',
 'ihlia':'illia',
 'ixihlamiki':'ixillamiki',
 'ixkoihlia':'ixkoillia',
 'ixtemahlowa':'ixtemallowa',
 'kahkahlapoa':'kahkallapoa',
 'kakahlapoa':'kakallapoa',
 'kakahlapoa':'kakallapoa',
 'kahlapoa':'kallapoa',
 'kahlapoa':'kallapoa',
 'kahlapowilia':'kallapowilia',
 'oκihlowa':'oκillowa',
 'senihlia':'senillia',
 'temahlowa':'temallowa',
 'tokaxihlamiki':'tokaxillamiki',
 'wahwahla':'wahwalla',
 'wahwahlika':'wahwallika',
 'wahwahlikilia':'wahwallikilia',
 'wahla':'walla',
 'wahlika':'wallika',
 'wahlikilia':'wallikilia',
 'wawahlika':'wawallika',
 'wehli':'welli',
 'weweyakihli':'weweyakilli',
 'wisahloti':'wisalloti',
 'wisahloλ':'wisalloλ',
 'yolihlia':'yolillia',
 'λaihihlia':'λaihillia',
 'λahlamiki':'λallamiki',
 'λahlamikiltia':'λallamikiltia',
 'λahlowa':'λallowa',
 'λamanteihlia':'λamanteillia',
 'λamantiihlia':'λamantiillia',
 'λaseselihli':'λaseselilli',
 'λateihlia':'λateillia',
 'κaςahkohlanwia':'κaςahkollanwia',
 'κaλaihihlia':'κaλaihillia',
 'κaλahlamiki':'κaλallamiki'
};

///////////////////////////////////
//
// singleToGeminated
//
// In modern usage, we may see
// spellings like 'ita' that we
// here map back to the geminated
// form, 'itta' ...
//
///////////////////////////////////
const singleToGeminated = {
 'ahkoita':'ahkoitta',
 'ahkoleκenia':'ahkolleκenia',
 'ahweςowa':'ahweςςowa',
 'esokisa':'essokisa',
 'esokixtia':'essokixtia',
 'esotemo':'essotemo',
 'esoti':'essoti',
 'esotia':'essotia',
 'esoςiςina':'essoςiςina',
 'ihita':'ihitta',
 'ihtiwelita':'ihtiwelitta',
 'iilamiki':'iillamiki',
 'ikxiwelita':'ikxiwelitta',
 'ilamiki':'illamiki',
 'ilamikilia':'illamikilia',
 'ilamikiltia':'illamikiltia',
 'ilia':'illia',
 'ita':'itta',
 'ixilamiki':'ixillamiki',
 'ixita':'ixitta',
 'ixkoilia':'ixkoillia',
 'ixtemalowa':'ixtemallowa',
 'ixipewa':'ixxipewa',
 'ixipewi':'ixxipewi',
 'ixixipeka':'ixxixipeka',
 'ixixipeτa':'ixxixipeτa',
 'ixκatewia':'ixκatewwia',
 'kahkalapoa':'kahkallapoa',
 'kakalapoa':'kakallapoa',
 'kakalapoa':'kakallapoa',
 'kalapoa':'kallapoa',
 'kalapoa':'kallapoa',
 'kalapowilia':'kallapowilia',
 'kalτonamaka':'kalτonnamaka',
 'kamaihita':'kamaihitta',
 'kenipati':'kennipati',
 'kenopati':'kennopati',
 'koςmikamiki':'koςmikkamiki',
 'mahmawitekeτa':'mahmawitekkeτa',
 'maneneτoti':'maneneττoti',
 'mawitekeτa':'mawitekkeτa',
 'melakeτa':'melakkeτa',
 'mixtekeτa':'mixtekkeτa',
 'mixκatewia':'mixκatewwia',
 'nakasihita':'nakasihitta',
 'nakasepowi':'nakassepowi',
 'nakasepoya':'nakassepoya',
 'nakaςihkiliwi':'nakaςςihkiliwi',
 'nakaςihkiloa':'nakaςςihkiloa',
 'nakaςihkilti':'nakaςςihkilti',
 'nexkomana':'nexkommana',
 'nexkomanilia':'nexkommanilia',
 'neκa':'neκκa',
 'oκilowa':'oκillowa',
 'panamaka':'pannamaka',
 'panamakilia':'pannamakilia',
 'panamakiltia':'pannamakiltia',
 'panawaltia':'pannawaltia',
 'panesi':'pannesi',
 'panextia':'pannextia',
 'pokisa':'pokkisa',
 'sansekotekiwia':'sansekkotekiwia',
 'sansekoti':'sansekkoti',
 'sansekotilia':'sansekkotilia',
 'sansekoλalia':'sansekkoλalia',
 'semaka':'semmaka',
 'semana':'semmana',
 'semani':'semmani',
 'semaniwi':'semmaniwi',
 'semihyoκi':'semmihyoκi',
 'semoyakti':'semmoyakti',
 'semoyawa':'semmoyawa',
 'semoyawi':'semmoyawi',
 'semoyawilia':'semmoyawilia',
 'senilia':'senillia',
 'sinamaka':'sinnamaka',
 'sinamaka':'sinnamaka',
 'sinamakilia':'sinnamakilia',
 'sinamakiltia':'sinnamakiltia',
 'tekaita':'tekaitta',
 'tekakti':'tekkakti',
 'temalowa':'temallowa',
 'tenistakisa':'tenistakkisa',
 'tenahnamiki':'tennahnamiki',
 'tenamiki':'tennamiki',
 'tenamikilia':'tennamikilia',
 'tenamiktia':'tennamiktia',
 'tenehpanoa':'tennehpanoa',
 'tenκalakisa':'tenκalakkisa',
 'tokaxilamiki':'tokaxillamiki',
 'wahwala':'wahwalla',
 'wahwalika':'wahwallika',
 'wahwalikilia':'wahwallikilia',
 'wala':'walla',
 'walika':'wallika',
 'walikilia':'wallikilia',
 'wawalika':'wawallika',
 //'weli':'welli',
 'weweyakili':'weweyakilli',
 'wihτontekeτa':'wihτontekkeτa',
 'wisaloti':'wisalloti',
 'wisaloλ':'wisalloλ',
 'wiwiita':'wiwiitta',
 'yakaita':'yakaitta',
 'yehyekaita':'yehyekkaitta',
 'yehyekamaςilia':'yehyekkamaςilia',
 'yolilia':'yolillia',
 'yoyonamaka':'yoyonnamaka',
 'yoyonamaka':'yoyonnamaka',
 'yoyonamakiltia':'yoyonnamakiltia',
 'λaahweςowa':'λaahweςςowa',
 'λahkoita':'λahkoitta',
 'λaihilia':'λaihillia',
 'κaiςiwi':'κaiςςiwi',
 'κaiςowa':'κaiςςowa',
 'λakakeτin':'λakakkeτin',
 'κalankaita':'κalankaitta',
 'λalamiki':'λallamiki',
 'λalamikiltia':'λallamikiltia',
 'λalowa':'λallowa',
 'λamanteilia':'λamanteillia',
 'λamantiilia':'λamantiillia',
 'λamiita':'λamiitta',
 'λanahnamiktia':'λannahnamiktia',
 'λaneτκa':'λanneτκa',
 'λaniτκa':'λanniτκa',
 'κasemoyawa':'κasemmoyawa',
 'κasemoyawi':'κasemmoyawi',
 'λaseselili':'λaseselilli',
 'λateilia':'λateillia',
 'κatemeτonti':'κatemeττonti',
 'λatenamiki':'λatennamiki',
 'κatewia':'κatewwia',
 'κatewilia':'κatewwilia',
 'κawelita':'κawelitta',
 'κawelita':'κawelitta',
 'λaxima':'λaxxima',
 'λayekantiya':'λayekkantiya',
 'κaςahkolanwia':'κaςahkollanwia',
 'κaλaihilia':'κaλaihillia',
 'κaλalamiki':'κaλallamiki',
 'κaτonkalsemoyawa':'κaτonkalsemmoyawa',
 'κaτonkalsemoyawi':'κaτonkalsemmoyawi',
 'λaςe':'λaςςe',
 'λepanita':'λepanitta',
 'τinahnawa':'τinnahnawa',
 'τineκiliwi':'τinneκiliwi',
 'τineκiloa':'τinneκiloa',
 'τonkalsemoyawa':'τonkalsemmoyawa',
 'τonkalsemoyawi':'τonkalsemmoyawi'
};

///////////////////////////////////////
//
// respellVerbStem
//
// 
///////////////////////////////////////
function respellVerbStem(stem){
 if(acheToElle[stem]){
   return acheToElle[stem];
 }else if(singleToGeminated[stem]){
   return singleToGeminated[stem];
 }else{
   return stem;
 }
}

//
// EXPORTS:
//
exports.respellVerbStem = respellVerbStem;

