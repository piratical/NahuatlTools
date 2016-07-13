//
// generateLigatures.js (c) 2016.05.30 by Ed Trager
//


//
// data:
//
data:{
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
  {id:'',offset:'',glyfid:'0',width:'0'},
  {id:'aa.vs', offset:'60832', glyfid:'90', width:'0'},
  {id:'ee.vs', offset:'60833', glyfid:'29', width:'0'},
  {id:'ii.vs', offset:'60834', glyfid:'30', width:'0'},
  {id:'oo.vs', offset:'60835', glyfid:'31', width:'0'},
  {id:'uu.vs', offset:'60836', glyfid:'32', width:'0'},
  {id:'ia.vs', offset:'60837', glyfid:'33', width:'0'},
  {id:'ai.vs', offset:'60838', glyfid:'34', width:'0'},
  {id:'oa.vs', offset:'60839', glyfid:'35', width:'0'},
  {id:'eo.vs', offset:'60840', glyfid:'36', width:'0'},
  {id:'ei.vs', offset:'60841', glyfid:'37', width:'0'}
 ],
 bases:[
  {id:'aa.base', offset:'60816', glyfid:'25', width:'1254'},
  {id:'ee.base', offset:'60817', glyfid:'26', width:'1362'},
  {id:'ii.base', offset:'60818', glyfid:'27', width:'1289'},
  {id:'oo.base', offset:'60819', glyfid:'28', width:'1131'},
  {id:'uu.base', offset:'60820', glyfid:'89', width:'1303'},
  {id:'ma', offset:'60848', glyfid:'42', width:'1653'},
  {id:'na', offset:'60849', glyfid:'44', width:'1220'},
  {id:'pa', offset:'60850', glyfid:'45', width:'1362'},
  {id:'ta', offset:'60851', glyfid:'46', width:'1030'},
  {id:'ca', offset:'60852', glyfid:'47', width:'1039'},
  {id:'cua', offset:'60853', glyfid:'48', width:'1122'},
  {id:'tza', offset:'60854', glyfid:'49', width:'1186'},
  {id:'tla', offset:'60855', glyfid:'50', width:'1214'},
  {id:'cha', offset:'60856', glyfid:'58', width:'1026'},
  {id:'sa', offset:'60857', glyfid:'59', width:'1497'},
  {id:'xa', offset:'60858', glyfid:'60', width:'1481'},
  {id:'ha', offset:'60859', glyfid:'61', width:'1275'},
  {id:'la', offset:'60860', glyfid:'62', width:'885'},
  {id:'ya', offset:'60861', glyfid:'63', width:'1220'},
  {id:'wa', offset:'60862', glyfid:'64', width:'1652'},
  {id:'nya', offset:'60864', glyfid:'72', width:'1122'},
  {id:'bva', offset:'60865', glyfid:'73', width:'1097'},
  {id:'da', offset:'60866', glyfid:'74', width:'1095'},
  {id:'ga', offset:'60867', glyfid:'75', width:'1362'},
  {id:'fa', offset:'60868', glyfid:'76', width:'1004'},
  {id:'ra', offset:'60869', glyfid:'77', width:'1003'},
  {id:'rra', offset:'60870', glyfid:'78', width:'1303'}
 ],
 subjoiners:[
  {id:'ma.sub', offset:'60880', glyfid:'43', width:'0'},
  {id:'na.sub', offset:'60881', glyfid:'51', width:'0'},
  {id:'pa.sub', offset:'60882', glyfid:'52', width:'0'},
  {id:'ta.sub', offset:'60883', glyfid:'53', width:'0'},
  {id:'ca.sub', offset:'60884', glyfid:'54', width:'0'},
  {id:'cua.sub', offset:'60885', glyfid:'55', width:'0'},
  {id:'tza.sub', offset:'60886', glyfid:'56', width:'0'},
  {id:'tla.sub', offset:'60887', glyfid:'57', width:'0'},
  {id:'cha.sub', offset:'60888', glyfid:'65', width:'0'},
  {id:'sa.sub', offset:'60889', glyfid:'66', width:'0'},
  {id:'xa.sub', offset:'60890', glyfid:'67', width:'0'},
  {id:'ha.sub', offset:'60891', glyfid:'68', width:'0'},
  {id:'la.sub', offset:'60892', glyfid:'69', width:'0'},
  {id:'ya.sub', offset:'60893', glyfid:'70', width:'0'},
  {id:'wa.sub', offset:'60894', glyfid:'71', width:'0'},
  {id:'nya.sub', offset:'60896', glyfid:'79', width:'0'},
  {id:'bva.sub', offset:'60897', glyfid:'80', width:'0'},
  {id:'da.sub', offset:'60898', glyfid:'81', width:'0'},
  {id:'ga.sub', offset:'60899', glyfid:'82', width:'0'},
  {id:'fa.sub', offset:'60900', glyfid:'83', width:'0'},
  {id:'ra.sub', offset:'60901', glyfid:'84', width:'0'},
  {id:'rra.sub', offset:'60902', glyfid:'85', width:'0'}
 ]
}

//
// magic stuff:
//
	var currentOffset=60928;
	var currentGlyphId=97;
	var EOL="\n";

//
// generateLigatures
//
function generateLigature(i,j,k){
	var s="";
	
	if(data.vowelSigns[i].glyfid=='0'){
		// Case of NO VOWEL SIGN:
		s+= 'StartChar: ' + data.bases[j].id + '.' + data.subjoiners[k] + ".lig" + EOL;
	}else{
		// Otherwise VOWEL SIGN PRESENT:
		s+= 'StartChar: ' + data.vowelSigns[i].id + '.' + data.bases[j].id + '.' + data.subjoiners[k] + ".lig" + EOL;
	}
	
	s+= 'Encoding: ' + currentOffset + ' ' + currentOffset + ' ' + currentGlyphId + EOL;
	
	currentOffset++;
	currentGlyphId++;
	
	s+= 'Width: ' + data.bases[j].width + EOL;
	s+= 'VWidth: 0' + EOL;
	s+= 'GlyphClass: 3' + EOL;
	s+= 'Flags:HW' + EOL;
	s+= 'LayerCount: 2' + EOL;
	s+= 'Fore' + EOL;
	if(data.vowelSigns[i].glyfid > '0'){
		s+= 'Refer: '  + data.vowelSigns[i].glyfid + ' ' + data.vowelSigns[i].offset + ' S 1 0 0 1 ' + data.vowelSigns[i].width + ' 0 2' + EOL;
		s+= 'Refer: '  + bases[j].glyfid + ' ' + data.bases[j].offset + ' N 1 0 0 1 ' + data.bases[j].width + ' 0 2' + EOL;
		s+= 'Refer: '  + subjoinkers[k].glyfid + ' ' + data.subjoiners[k].offset + ' N 1 0 0 1 ' + data.subjoiners[k].width + ' 0 2' + EOL;
	}else{
		s+= 'Refer: '  + bases[j].glyfid + ' ' + data.bases[j].offset + ' S 1 0 0 1 ' + data.bases[j].width + ' 0 2' + EOL;
		s+= 'Refer: '  + subjoinkers[k].glyfid + ' ' + data.subjoiners[k].offset + ' N 1 0 0 1 ' + data.subjoiners[k].width + ' 0 2' + EOL;
	}
	s+= 'EndChar' + EOL + EOL;
	return s;
}

//
// loop
//
function loop(){
	var i=0;
	var j=0;
	var k=0;
	var code="";
	
	for(i=0;i<data.vowelSigns.length;i++){
		for(j=0;j<data.bases.length;j++){
			for(k=0;k<data.subjoiners.length;k++){
				code+=generateLigature(i,j,k);
			}
		}
	}
	return code;
}




