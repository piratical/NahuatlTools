#!/usr/bin/env node
//
// generateLigatures.js (c) 2016.05.30 by Ed Trager
//
// Here are directions for the entire procedure:
//
// (1) run:
//            ./generateLigatures.sh > mid.txt
//
// (2) cat start.txt mid.txt end.txt > result.sfd
//
//     "start.txt" is an existing FontForge SFD file, all the way up to
//                 last glyph but not including "EndChars" & "EndSplineFont"
//
//     N.B.: Be sure that start.txt has the correct definitions for the GSUB table(s)
//           and subtable(s) that will be filled in after running this script!
//
//     "end.txt" consists of just the "EndChars" and "EndSplineFont" closers.
//
//     "mid.txt" is obviously the section containing all the generated ligatures
//
// (3) Use FontForge to open the "result.sfd" file and generate the final font.
//     (The file is for some reason called "new.sfd" in my NahuatlTools github repository)
//



//
// data: These data were culled directly from the NahuatlOne 
//       FontForge SFD file:
//
var data={
 // others are not used currently
 others:
 [
  {id:'subjoiner_symbol', offset:'60843', glyfid:'38', width:'1095'},
  {id:'place.sign', offset:'60845', glyfid:'39', width:'703'},
  {id:'name.sign', offset:'60846', glyfid:'40', width:'459'},
  {id:'diety.sign', offset:'60847', glyfid:'41', width:'678'},
  {id:'x', offset:'120', glyfid:'86', width:'921'},
  {id:'period', offset:'46', glyfid:'87', width:'432'},
  {id:'space', offset:'32', glyfid:'88', width:'1180'},
  {id:'long_vowel_dot', offset:'60821', glyfid:'91', width:'0'},
  {id:'aa.vs.long', offset:'60912', glyfid:'92', width:'2048'},
  {id:'ee.vs.long', offset:'60913', glyfid:'93', width:'2048'},
  {id:'ii.vs.long', offset:'60914', glyfid:'94', width:'2048'},
  {id:'oo.vs.long', offset:'60915', glyfid:'95', width:'2048'},
  {id:'uu.vs.long', offset:'60916', glyfid:'96', width:'2048'},
  {id:'ma.ma.lig', offset:'60928', glyfid:'97', width:'0'},
  {id:'ma.na.lig', offset:'60929', glyfid:'98', width:'1653'},
  {id:'na.ma.lig', offset:'60930', glyfid:'99', width:'1220'},
  {id:'na.na.lig', offset:'60931', glyfid:'100', width:'1220'}
 ],
 vowelSigns:
 [
  // Don't generate aa vowel sign ligatures:
  //{id:'aa.vs', offset:'60832', glyfid:'90', width:'150',va:'-284',sa:''},
  {id:'ee.vs', offset:'60833', glyfid:'29', width:'150',va:'-390',sa:''},
  {id:'ii.vs', offset:'60834', glyfid:'30', width:'150',va:'-280',sa:''},
  {id:'oo.vs', offset:'60835', glyfid:'31', width:'150',va:'-249',sa:''},
  {id:'uu.vs', offset:'60836', glyfid:'32', width:'150',va:'-251',sa:''},
  {id:'ia.vs', offset:'60837', glyfid:'33', width:'150',va:'-414',sa:''},
  {id:'ai.vs', offset:'60838', glyfid:'34', width:'150',va:'-378',sa:''},
  {id:'oa.vs', offset:'60839', glyfid:'35', width:'150',va:'-366',sa:''},
  {id:'eo.vs', offset:'60840', glyfid:'36', width:'150',va:'-358',sa:''},
  {id:'ei.vs', offset:'60841', glyfid:'37', width:'150',va:'-457',sa:''},
  {id:'io.vs', offset:'60842', glyfid:'105', width:'150',va:'-366',sa:''},
  // This case is for no vowel sign but subjoiners:
  {id:'',offset:'',glyfid:'0',width:'0'}
 ],
 bases:[
  //
  // va => x-coordinate of the above-base vowel sign anchor
  // sa => x-coordinate of the below-base subjoiner anchor
  //
  {id:'aa.base', offset:'60816', glyfid:'25', width:'1254',va:'622',sa:'622'},
  {id:'ee.base', offset:'60817', glyfid:'26', width:'1362',va:'680',sa:'680'},
  {id:'ii.base', offset:'60818', glyfid:'27', width:'1289',va:'645',sa:'645'},
  {id:'oo.base', offset:'60819', glyfid:'28', width:'1131',va:'568',sa:'568'},
  {id:'uu.base', offset:'60820', glyfid:'89', width:'1303',va:'602',sa:'602'},
  {id:'ma', offset:'60848', glyfid:'42', width:'1653',va:'823',sa:'840'},
  {id:'na', offset:'60849', glyfid:'44', width:'1220',va:'613',sa:'630'},
  {id:'pa', offset:'60850', glyfid:'45', width:'1362',va:'663',sa:'680'},
  {id:'ta', offset:'60851', glyfid:'46', width:'1030',va:'513',sa:'530'},
  {id:'ca', offset:'60852', glyfid:'47', width:'1039',va:'553',sa:'570'},
  {id:'cua', offset:'60853', glyfid:'48', width:'1122',va:'543',sa:'560'},
  {id:'tza', offset:'60854', glyfid:'49', width:'1186',va:'583',sa:'600'},
  {id:'tla', offset:'60855', glyfid:'50', width:'1214',va:'583',sa:'600'},
  {id:'cha', offset:'60856', glyfid:'58', width:'1026',va:'522',sa:'539'},
  {id:'sa', offset:'60857', glyfid:'59', width:'1497',va:'743',sa:'760'},
  {id:'xa', offset:'60858', glyfid:'60', width:'1481',va:'753',sa:'742'},
  {id:'ha', offset:'60859', glyfid:'61', width:'1275',va:'533',sa:'550'},
  {id:'la', offset:'60860', glyfid:'62', width:'885',va:'433',sa:'450'},
  {id:'ya', offset:'60861', glyfid:'63', width:'1220',va:'598',sa:'615'},
  {id:'wa', offset:'60862', glyfid:'64', width:'1652',va:'808',sa:'825'},
  {id:'nya', offset:'60864', glyfid:'72', width:'1122',va:'530',sa:'547'},
  {id:'bva', offset:'60865', glyfid:'73', width:'1097',va:'548',sa:'565'},
  {id:'da', offset:'60866', glyfid:'74', width:'1095',va:'527',sa:'544'},
  {id:'ga', offset:'60867', glyfid:'75', width:'1362',va:'667',sa:'684'},
  {id:'fa', offset:'60868', glyfid:'76', width:'1004',va:'498',sa:'515'},
  {id:'ra', offset:'60869', glyfid:'77', width:'1003',va:'478',sa:'495'},
  {id:'rra', offset:'60870', glyfid:'78', width:'1303',va:'598',sa:'615'}
 ],
 subjoiners:[
  //
  // va => x-coordinate of the vowel sign anchor (not applicable here)
  // sa => x-coordinate of the below-base subjoiner anchor
  //
  {id:'ma.sub', offset:'60880', glyfid:'43', width:'0',va:'',sa:'-710'},
  {id:'na.sub', offset:'60881', glyfid:'51', width:'0',va:'',sa:'-531'},
  {id:'pa.sub', offset:'60882', glyfid:'52', width:'0',va:'',sa:'-590'},
  {id:'ta.sub', offset:'60883', glyfid:'53', width:'0',va:'',sa:'-480'},
  {id:'ca.sub', offset:'60884', glyfid:'54', width:'0',va:'',sa:'-410'},
  {id:'cua.sub', offset:'60885', glyfid:'55', width:'0',va:'',sa:'-470'},
  {id:'tza.sub', offset:'60886', glyfid:'56', width:'0',va:'',sa:'-540'},
  {id:'tla.sub', offset:'60887', glyfid:'57', width:'0',va:'',sa:'-580'},
  {id:'cha.sub', offset:'60888', glyfid:'65', width:'0',va:'',sa:'-461'},
  {id:'sa.sub', offset:'60889', glyfid:'66', width:'0',va:'',sa:'-710'},
  {id:'xa.sub', offset:'60890', glyfid:'67', width:'0',va:'',sa:'-636'},
  {id:'ha.sub', offset:'60891', glyfid:'68', width:'0',va:'',sa:'-330'},
  {id:'la.sub', offset:'60892', glyfid:'69', width:'0',va:'',sa:'-400'},
  {id:'ya.sub', offset:'60893', glyfid:'70', width:'0',va:'',sa:'-535'},
  {id:'wa.sub', offset:'60894', glyfid:'71', width:'0',va:'',sa:'-705'},
  {id:'nya.sub', offset:'60896', glyfid:'79', width:'0',va:'',sa:'-493'},
  {id:'bva.sub', offset:'60897', glyfid:'80', width:'0',va:'',sa:'-485'},
  {id:'da.sub', offset:'60898', glyfid:'81', width:'0',va:'',sa:'-525'},
  {id:'ga.sub', offset:'60899', glyfid:'82', width:'0',va:'',sa:'-622'},
  {id:'fa.sub', offset:'60900', glyfid:'83', width:'0',va:'',sa:'-465'},
  {id:'ra.sub', offset:'60901', glyfid:'84', width:'0',va:'',sa:'-455'},
  // Seems like subjoined cases of RRA will not occur:
  // {id:'rra.sub', offset:'60902', glyfid:'85', width:'0',va:'',sa:'-545'},
  // This case is the one where there is no subjoiner, only vowel signs:
  {id:'',offset:'',glyfid:'0',width:'0',va:'',sa:''}
 ]
}

//
// magic stuff:
//
// => In FontForge, I originally made a few sample ligatures in order to 
//    see how Fontforge would write the entries in the SFD files for
//    ligatures created using references to existing glyphs or glyph components.
//
//    The "currentOffset" appears to be the index which FontForge uses for the
//    Unicode CMAP. In the SFD file, this is expressed in decimal format, so one
//    has to convert to hex format if you need to lookup where these entries will
//    be in Unicode.
//
//    For the "pre-Unicode" Nahuatl abugida, I had already chosen and
//    created glyphs in the "reserveStart" to "reserveEnd" region. This was done
//    before I ever thought about generating all these ligatures. However after
//    I discovered bugs especially on the Apple platforms (OSX, iPhone, iPad)
//    where the GPOS positioning instructions appear to be ignored, I chose to
//    generate these referential ligatures as a work-around.
//
	var currentOffset=57344 // = U+E000, the start of the PUA region
	var reserveStart =60816 // = U+ED90, this is where the abugida glyphs start
	var reserveEnd   =60919 // = U+EDF7, this is where the abugida glyphs end
	
	// obsolete value: var currentOffset=60928; // This is the decimal equivalent of U+EE00 which is just beyond the last already-defined glyph
	// obsolete value: var currentGlyphId=97;
	
	var currentGlyphId=106;   // This is the next sequentially available glyph index
	var EOL="\n";

//
// generateLigatures
//
// This generates one referential ligature glyph entry in the SFD format
//
function generateLigature(i,j,k){
	
	var s="";
	if(data.vowelSigns[i].glyfid=='0' && data.subjoiners[k].glyfid=='0'){
		// neither a VOWEL SIGN or SUBJOINER 
		// so no ligature so skip such cases
		return s;
	}
	
	var vName=data.vowelSigns[i].id; vName = vName.replace(/\..+$/, "");
	var bName=data.bases[j].id;      bName = bName.replace(/\..+$/, "");
	var sName=data.subjoiners[k].id; sName = sName.replace(/\..+$/, "");
	
	var vOffset = data.bases[j].va - data.vowelSigns[i].va;
	var sOffset = data.bases[j].sa - data.subjoiners[k].sa;
	
	if(data.vowelSigns[i].glyfid=='0'){
		// Case of NO VOWEL SIGN:
		s+= 'StartChar: ' + bName + '.' + sName + ".lig" + EOL;
	}else if(data.subjoiners[k].glyfid=='0'){
		// VOWEL SIGN but NO SUBJOINER:
		s+= 'StartChar: ' + bName + '.' + vName + ".lig" + EOL;
	}else{
		// All other cases with VOWEL SIGN and SUBJOINER present:
		s+= 'StartChar: ' + bName + '.' + vName + '.' + sName + ".lig" + EOL;
	}
	
	s+= 'Encoding: ' + currentOffset + ' ' + currentOffset + ' ' + currentGlyphId + EOL;
	
	currentOffset++;
	/////////////////////////////////////////////////////////////////
	// 2016.07.27.ET ADDENDUM:
	// NOTA BENE: THIS IS WHERE WE "JUMP OVER" OUR RESERVED SECTION:
	//
	/////////////////////////////////////////////////////////////////
	if(currentOffset==reserveStart){
		currentOffset=reserveEnd+1;
	}
	currentGlyphId++;
	
	s+= 'Width: ' + data.bases[j].width + EOL;
	s+= 'VWidth: 0' + EOL;
	s+= 'GlyphClass: 3' + EOL;
	s+= 'Flags:HW' + EOL;
	s+= 'LayerCount: 2' + EOL;
	s+= 'Fore' + EOL;
	
	if(data.vowelSigns[i].glyfid=='0'){
		// No VOWEL SIGN but has SUBJOINER:
		s+= 'Refer: '  + data.bases[j].glyfid + ' ' + data.bases[j].offset + ' S 1 0 0 1 ' + 0  + ' 0 2' + EOL;
		s+= 'Refer: '  + data.subjoiners[k].glyfid + ' ' + data.subjoiners[k].offset + ' N 1 0 0 1 ' + sOffset + ' 0 2' + EOL;
		s+= 'Ligature2: "BaseSubLookup2 subtable2" ' + data.bases[j].id + ' subjoiner_symbol '+ sName + EOL;
	}else if(data.subjoiners[k].glyfid=='0'){
		// No SUBJOINER but has VOWEL SIGN:
		s+= 'Refer: '  + data.vowelSigns[i].glyfid + ' ' + data.vowelSigns[i].offset + ' S 1 0 0 1 ' + vOffset + ' 0 2' + EOL;
		s+= 'Refer: '  + data.bases[j].glyfid + ' ' + data.bases[j].offset + ' N 1 0 0 1 ' + 0 + ' 0 2' + EOL;
		s+= 'Ligature2: "BaseSubLookup1 subtable1" ' + data.bases[j].id + ' ' + data.vowelSigns[i].id + EOL;
	}else{
		// Has both VOWEL SIGN and SUBJOINER:
		s+= 'Refer: '  + data.vowelSigns[i].glyfid + ' ' + data.vowelSigns[i].offset + ' S 1 0 0 1 ' + vOffset + ' 0 2' + EOL;
		s+= 'Refer: '  + data.bases[j].glyfid + ' ' + data.bases[j].offset + ' N 1 0 0 1 ' + 0 + ' 0 2' + EOL;
		s+= 'Refer: '  + data.subjoiners[k].glyfid + ' ' + data.subjoiners[k].offset + ' N 1 0 0 1 ' + sOffset + ' 0 2' + EOL;
		s+= 'Ligature2: "BaseSubLookup0 subtable0" ' + data.bases[j].id + ' ' + data.vowelSigns[i].id + ' subjoiner_symbol '+ sName + EOL;
	}
	s+= 'EndChar' + EOL + EOL;
	return s;
}

//
// loop
//
// => Loop over vowel signs (i), base consonants (j), and subjoined consonant glyphs (k):
//
function loop(){
	var i=0;
	var j=0;
	var k=0;
	var code="";
	
	for(i=0;i<data.vowelSigns.length;i++){
		for(j=0;j<data.bases.length;j++){
			if(i>0 && j<5){
				// do not put vowel signs on top of vowel bases
			}else{
				for(k=0;k<data.subjoiners.length;k++){
					code+=generateLigature(i,j,k);
				}
			}
		}
	}
	return code;
}

//
// MAIN
//
var result = loop();
//
// console.log just prints to the terminal:
//
console.log(result);


