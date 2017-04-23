#!/usr/bin/env node
//
// smartCoder.js (c) 2017 by Edward H. Trager ALL RIGHTS RESERVED
//
// released under GNU GPL 2.0 or later at your discretion
//
// Initiated on: 2017.04.19.ET
// 

///////////////////////////
//
// arguments:
//
///////////////////////////
var path = process.argv[2];

///////////////////////////
//
// require filesystem:
//
///////////////////////////
var fs   = require("fs");

////////////////////////////
//
// global vars:
//
////////////////////////////

if(process.argv.length!=3){
	console.log("Usage: " + process.argv[1] + " <argument>");
	return 1;
}

/////////////////////////////////////////////////////////////
//
// Current pre-Unicode code assignments in NahuatlOne font:
//
// NOTA BENE: THESE CHANGE IF 
// FUTURE SCRIPT PROPOSAL GETS ACCEPTED 
// BY UNICODE CONSORTIUM
//
// CURRENTLY THESE ARE PRIVATE USE AREA
// (PUA) ASSIGNMENTS USED IN THE 
// NahuatlOne font:
//
//////////////////////////////////////////////////////////////

// Vowel Letters:
//String.fromCodePoint(
var vl_A = String.fromCodePoint(0xED90);
var vl_E = String.fromCodePoint(0xED91);
var vl_I = String.fromCodePoint(0xED92);
var vl_O = String.fromCodePoint(0xED93);
var vl_U = String.fromCodePoint(0xED94);

// Long Vowel Sign (rarely used):
var longVowelSign = String.fromCodePoint(0xED95);

// Vowel Signs:
var vs_A = String.fromCodePoint(0xEDA0);
var vs_E = String.fromCodePoint(0xEDA1);
var vs_I = String.fromCodePoint(0xEDA2);
var vs_O = String.fromCodePoint(0xEDA3);
var vs_U = String.fromCodePoint(0xEDA4);

// Native Consonants:
var c_MA  = String.fromCodePoint(0xEDB0);
var c_NA  = String.fromCodePoint(0xEDB1);
var c_PA  = String.fromCodePoint(0xEDB2);
var c_TA  = String.fromCodePoint(0xEDB3);
var c_CA  = String.fromCodePoint(0xEDB4);
var c_CUA = String.fromCodePoint(0xEDB5);
var c_TZA = String.fromCodePoint(0xEDB6);
var c_TLA = String.fromCodePoint(0xEDB7);
var c_CHA = String.fromCodePoint(0xEDB8);
var c_SA  = String.fromCodePoint(0xEDB9);
var c_XA  = String.fromCodePoint(0xEDBA);
var c_HA  = String.fromCodePoint(0xEDBB);
var c_LA  = String.fromCodePoint(0xEDBC);
var c_WA  = String.fromCodePoint(0xEDBE);
var c_YA  = String.fromCodePoint(0xEDBD);

// Additional Spanish Consonants:
var c_NYA = String.fromCodePoint(0xEDC0);
var c_BVA = String.fromCodePoint(0xEDC1);
var c_DA  = String.fromCodePoint(0xEDC2);
var c_GA  = String.fromCodePoint(0xEDC3);
var c_FA  = String.fromCodePoint(0xEDC4);
var c_RA  = String.fromCodePoint(0xEDC5);
var c_RRA = String.fromCodePoint(0xEDC6);

// Compound (Dipthong) Vowel Signs:
var vs_IA = String.fromCodePoint(0xEDA5);
var vs_AI = String.fromCodePoint(0xEDA6);
var vs_OA = String.fromCodePoint(0xEDA7);
var vs_EO = String.fromCodePoint(0xEDA8);
var vs_EI = String.fromCodePoint(0xEDA9);
var vs_IO = String.fromCodePoint(0xEDAA);

// Subjoiner sign:
var subjoinerSign = String.fromCodePoint(0xEDAB);

// Special Prefix signs (rarely used):
var prefixPlace = String.fromCodePoint(0xEDAD);
var prefixName  = String.fromCodePoint(0xEDAE);
var prefixDiety = String.fromCodePoint(0xEDAF);

// Unicode dottedCircle:
var dottedCircle = String.fromCodePoint(0x25CC);

///////////////////////////////////////////////
//
// END OF CODE POINT ASSIGNMENTS
//
////////////////////////////////////////////////

var consonantList =   c_MA  + c_NA  + c_PA  + c_TA 
                    + c_CA  + c_CUA + c_TZA + c_TLA
                    + c_CHA + c_SA  + c_XA  + c_HA 
                    + c_LA  + c_WA  + c_YA 
                    + c_NYA + c_BVA + c_DA  + c_GA 
                    + c_FA  + c_RA  +c_RRA;

var vowelList             = vl_A + vl_E + vl_I + vl_O + vl_U;
var vowelSignList         = vs_A + vs_E + vs_I + vs_O + vs_U;
var vowelDipthongSignList = vs_IA + vs_AI + vs_OA + vs_EO + vs_EI + vs_IO;

///////////////////////////////
//
// FUNCTIONS:
//
////////////////////////////////

//
// vowelToVowelSign
//
function vowelToVowelSign(vowel){
	
	switch(vowel){
	case vl_A:
		return vs_A;
	case vl_E:
		return vs_E;
	case vl_I:
		return vs_I;
	case vl_O:
		return vs_O;
	case vl_U:
		return vs_U;
	}
	// Should never get here:
	return "X";
}

//////////////////////////////////////////////////////////
//
// Add a replaceAll function to the native String class:
//
//////////////////////////////////////////////////////////
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//////////////////////////////////////////////////////////
//
// Add a replaceAt function since Javascript strings are unfortunately immutable:
//
//////////////////////////////////////////////////////////
String.prototype.replaceAt=function(index, replacement) {
	//return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
	return this.substr(0, index) + replacement+ this.substr(index + 1);
}

//////////////////////////////////////////////////////////
//
// convertToDipthongVowelSigns: used in function structure()
//
//////////////////////////////////////////////////////////
function convertToDipthongVowelSigns(str){
	str = str.replaceAll(vs_I + vl_A , vs_IA );
	str = str.replaceAll(vs_A + vl_I , vs_AI );
	str = str.replaceAll(vs_O + vl_A , vs_OA );
	str = str.replaceAll(vs_E + vl_O , vs_EO );
	str = str.replaceAll(vs_E + vl_I , vs_EI );
	str = str.replaceAll(vs_I + vl_O , vs_IO );
	return str;
}

//////////////////////////////////////////////////////////
//
// removeVowelSignA: used in function structure()
//
//////////////////////////////////////////////////////////
function removeVowelSignA(str){
	str = str.replaceAll(vs_A , "" );
	return str;
}

//////////////////////////////////////////////////////////
//
// preConversions():
//
// Do pre-processing to handle non-standard orthographies and spelling variants.
//
//////////////////////////////////////////////////////////
function preConversions(str){
	
	//
	// Prepend and postpend the string with a space character on each end, so
	// that we can use the space characters at the ends as sentinals for the beginning
	// or end of a word respectively, without further complicating our regular expressions.
	// That is, we use the space character in our regexs where applicable to detect word
	// boundaries. By prepending and postpending the entire string, we are able to include
	// the beginning and end of the string as word boundaries too without resorting to further
	// regex complexity:
	//
	str = " "+str+" ";
	
	// RULE 1: When "u" occurs between certain consonants, it is really an "o":
	//
	var rule1 = new RegExp(/([CcLlPpTt])ul/g);
	function myReplacer(str,group1){ return group1 + "ol"; }
	str = str.replace(rule1,myReplacer); // e.g.: Culhuacan to Colhuacan, Chapulin to Chapolin, Tullan to Tollan, etc.
	
	//
	// RULE 2: When a "u" is sandwiched between vowels, it is really a "w" (i.e., "hu"):
	//         => Also includes case where u preceded by space ...
	//
	var rule2 = new RegExp(/([ aeioAEIO])u([aeio])/g);
	function myReplacer2(str,group1,group2){ return group1 + "hu" + group2; }
	str = str.replace(rule2,myReplacer2); // e.g., nieua => niehua
	
	//
	// RULE 3: When a "u" is sandwiched between a preceding vowel and a following consonant, it is really a "w" (i.e., "uh"):
	//
	var rule3 = new RegExp(/([ aeioAEIO])u([ bcdfgklnñmptwxy])/g);
	function myReplacer3(str,group1,group2){ return group1 + "uh" + group2; }
	str = str.replace(rule3,myReplacer3); // e.g., kuau => kuauh ; kuautli => kuauhtli, etc.
	
	//
	// RULE 4: When a "y" is directly followed by a consonant, it is really an "i":
	//
	var rule4 = new RegExp(/[Yy]([bcdfghLlnñmptwxy])/g);
	function myReplacer4(str,group1){ return "i" + group1; }
	str = str.replace(rule4,myReplacer4); // e.g., yhuan => ihuan ; ypilhuan => ipilhuan, etc.
	
	//
	// Finally, remove the initial and final spaces that were added previously:
	//
	str = str.replace(/^ /,"");
	str = str.replace(/ $/,"");
	
	//
	// return:
	//
	return str;
}

////////////////////////////////////////////////// 
//
// convertDigraphs: Actually we also do some trigraphs, 
// and of course all the digraphs
//
////////////////////////////////////////////////// 
function convertDigraphs(str){
	// Actually, we start with TRIGRAPHs:
	str = str.replaceAll("cuh",c_CUA);         // converts cuh to /kʷ/ consonant
	str = str.replaceAll("[Qq]ua",c_CUA + vl_A); // converts to /kʷa/ consonant+vowel <= Included to handle cases like "Quauhtitlan" (i.e., "Cuauhtitlan")
	// Now the DIGRAPHs:
	str = str.replaceAll("[Hh]u",c_WA);        // converts hu to /w/  consonant. Do this *before* ch conversion to prevent misconversion of "ichui" etc.
	str = str.replaceAll("uh",c_WA);           // converts uh to /w/  consonant
	str = str.replaceAll("[Qq]u",c_CA);        // converts qu to /k/  consonant
	str = str.replaceAll("[Cc]u",c_CUA);       // converts cu to /kʷ/ consonant
	str = str.replaceAll("[Cc]e",c_SA + vl_E); // converts ce to /se/ consonant+vowel
	str = str.replaceAll("[Cc]i",c_SA + vl_I); // converts ci to /si/ consonant+vowel
	str = str.replaceAll("[Kk]u",c_CUA);       // converts ku to /kʷ/ consonant <= ortografía moderna*
	str = str.replaceAll("[Kk]w",c_CUA);       // converts ku to /kʷ/ consonant <= variente de la ortografía moderna*
	str = str.replaceAll("uc",c_CUA);          // converts uc to /kʷ/ consonant
	str = str.replaceAll("[Tt]z",c_TZA);       // converts tz to /t͡s/ consonant
	str = str.replaceAll("[Tt]s",c_TZA);       // converts ts to /t͡s/ consonant
	str = str.replaceAll("[Tt]l",c_TLA);       // converts tl to /t͡ɬ/ consonant
	str = str.replaceAll("[Cc]h",c_CHA);       // converts ch to /t͡ʃ/ consonant
	// The following only occurs in hispanicizations:
	str = str.replaceAll("rr",c_RRA);          // converts rr to trilled /r/ consonant
	
	// The following are Spanish-specific: ge and gi need to become /he/ and /hi/
	// (not /ge/ and /gi/) and jua needs to become /wa/. The vowels remain Latin
	// at this point so that the rest of the processing pipeline will function
	// correctly:
	str = str.replaceAll("[Gg]e" , c_HA + vl_E );
	str = str.replaceAll("[Gg]i" , c_HA + vl_I );
	str = str.replaceAll("[Jj]ua", c_WA + vl_A );
	return str;
}

////////////////////////////////////////////////// 
//
// convertSingleConsonants
//
////////////////////////////////////////////////// 
function convertSingleConsonants(str){
	
	str = str.replaceAll("[Mm]",c_MA);
	str = str.replaceAll("[Nn]",c_NA);
	str = str.replaceAll("[Pp]",c_PA);
	str = str.replaceAll("[Tt]",c_TA);
	str = str.replaceAll("[Cc]",c_CA);
	str = str.replaceAll("[Kk]",c_CA); // ortografía moderna
	str = str.replaceAll("[Ss]",c_SA); // ortografía moderna
	str = str.replaceAll("[Zz]",c_SA);
	str = str.replaceAll("[Xx]",c_XA);
	str = str.replaceAll("[Hh]",c_HA);
	str = str.replaceAll("[Jj]",c_HA); // ortografía moderna
	str = str.replaceAll("[Ll]",c_LA);
	str = str.replaceAll("[Yy]",c_YA);
	str = str.replaceAll("[Ww]",c_WA);
	str = str.replaceAll("[Ññ]",c_NYA);
	str = str.replaceAll("[Vv]",c_BVA);
	str = str.replaceAll("[Bb]",c_BVA);
	str = str.replaceAll("[Dd]",c_DA);
	str = str.replaceAll("[Gg]",c_GA);
	str = str.replaceAll("[Ff]",c_FA);
	str = str.replaceAll("[Rr]",c_RA);
	str = str.replaceAll("[Çç]",c_SA); // Remi Simeon orthography, inter alia
	return str;
}

////////////////////////////////////////////////// 
//
// convertVowels
//
////////////////////////////////////////////////// 
function convertVowels(str){
	
	str = str.replaceAll("[Aa]",vl_A);
	str = str.replaceAll("[Ee]",vl_E);
	str = str.replaceAll("[Ii]",vl_I);
	str = str.replaceAll("[Oo]",vl_O);
	str = str.replaceAll("[Uu]",vl_U); // "u" is supposed to only occur in foreign words in the classical orthography
	return str;
}

////////////////////////////////////////////////// 
//
// asciifyVowels
//
////////////////////////////////////////////////// 
function asciifyVowels(str){
	str = str.replaceAll("[āáàäâãĀÁÀÄÂÃ]","a");
	str = str.replaceAll("[éēèëêÉĒÈËÊ]"  ,"e");
	str = str.replaceAll("[íīìïîÍĪÌÏÎ]"  ,"i");
	str = str.replaceAll("[ōóòöôõŌÓÒÖÔÕ]","o");
	str = str.replaceAll("[ūúùüûŪÚÙÜÛ]"  ,"u");
	return str;
}

////////////////////////////////////////////////// 
//
// isConsonant
//
////////////////////////////////////////////////// 
function isConsonant(elem){
	if(elem==="") return false;
	else return consonantList.indexOf(elem) != -1;
}

////////////////////////////////////////////////// 
//
// isVowel
//
////////////////////////////////////////////////// 
function isVowel(elem){
	if(elem==="") return false;
	else return vowelList.indexOf(elem) != -1;
}

////////////////////////////////////////////////// 
//
// isVowelSignA
//
////////////////////////////////////////////////// 
function isVowelSignA(elem){
	return elem===vs_A;
}

////////////////////////////////////////////////// 
//
// isVowelU
//
////////////////////////////////////////////////// 
function isVowelU(elem){
	return elem===vl_U;
}

////////////////////////////////////////////////// 
//
// isVowelSign
//
////////////////////////////////////////////////// 
function isVowelSign(elem){
	return vowelSignList.indexOf(elem) != -1;
}

////////////////////////////////////////////////// 
//
// isLongVowelIndicator
//
////////////////////////////////////////////////// 
function isLongVowelIndicator(elem){
	return elem===longVowelSign;
}

////////////////////////////////////////////////// 
//
// isNotAbugida
//
////////////////////////////////////////////////// 
function isNotAbugida(elem){
	return !(isConsonant(elem) || isVowel(elem) || isLongVowelIndicator(elem));
}

////////////////////////////////////////////////// 
//
// before(): get the character before the current character in the string
//
////////////////////////////////////////////////// 
function before(i,arr){
	i--;
	if(i>=0 && i<arr.length){
		return isNotAbugida(arr[i])?"":arr[i];
	}else{
		return "";
	}
}

////////////////////////////////////////////////// 
//
// after(): get the character after the current character in the string
//
////////////////////////////////////////////////// 
function after(i,arr){
	i++;
	if(i>=0 && i<arr.length){
		return isNotAbugida(arr[i])?"":arr[i];
	}else{
		return "";
	}
}

////////////////////////////////////////////////// 
//
// twoAfter(): get the character AFTER the NEXT character in the string
//
////////////////////////////////////////////////// 
function twoAfter(i,arr){
	i+=2;
	if(i>=0 && i<arr.length){
		return isNotAbugida(arr[i])?"":arr[i];
	}else{
		return "";
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// structure(): Takes a "raw" string of abugida letters and
//              structures it into syllabic clusters by
//              doing the following:
//
//              (1) If there is a vowel following a consonant,
//                  convert the vowel to the corresponding 
//                  above-base vowel sign.
//
//              (2) If there is a consonant after the vowel *AND*
//                  that consonant is followed by another consonant
//                  (i.e., CVC·C), then the consonant directly after
//                  the vowel is a syllable-terminal consonant so
//                  convert it to a subjoined form.
//
//              (3) If there is a consonant after the vowel *AND*
//                  that consonant is followed by a space or 
//                  punctuation or some other non-abugida symbol,
//                  (i.e., CVC·x), then this is also a syllable-terminal
//                  consonant so convert it to the subjoined form.
//
//              (4) If there is an above-base vowel sign followed by
//                  a remaining atomic vowel letter, see if the pair
//                  can be converted to a single above-base combined
//                  vowel sign. NOTA BENE: Only some combined signs
//                  exist.
//
//              (5) Finally, /a/ is intrinsic on base consonants
//                  so remove the above-base vowel sign /a/ as the
//                  final step.
//
////////////////////////////////////////////////////////////////////////////////////
function structure(str){
	
	//
	// Phase 1: Convert vowels following consonants to the corresponding above-base vowel signs:
	//
	for(var i=0;i<str.length;i++){
		if(isVowel(str[i]) && isConsonant(before(i,str))){
			str = str.replaceAt(i,vowelToVowelSign(str[i]));
			//
			// Phase 2: If there is a consonant directly after the vowel
			//          and it is followed by another consonant after that (i.e., CVCC), then
			//          the convert the consonant directly after the vowel to the
			//          below base form by adding the subjoinerSign:
			//
			// Phase 3: If there is a consonant directly after a vowel and it is followed
			//          by a non-Abugida sign (such as punctuation, space, tab, etc.), then
			//          likewise convert this end-of-word consonant to the below base form:
			//
			if( isConsonant(after(i,str)) && 
			   ( isConsonant(twoAfter(i,str)) || 
			     isNotAbugida(twoAfter(i,str)) 
			   )
			  ){
				str = str.replaceAt(i+1,subjoinerSign+after(i,str));
			}
		}
		//
		// Phase 3.5: Fix up remaining vowels with trailing consonants:
		//
		if( (isVowel(str[i]) || str[i]===longVowelSign)
		    && isConsonant(after(i,str))
		    && (isNotAbugida(twoAfter(i,str)) || isConsonant(twoAfter(i,str)))
		  ){
			str = str.replaceAt(i+1,subjoinerSign+after(i,str));
		}
	}
	//
	// Phase 4: Convert to dipthong vowel signs when possible:
	//
	str = convertToDipthongVowelSigns(str);
	//
	// Phase 5: /a/ is intrinsic on base consonants, so remove /a/ as the final
	//          step:
	str = removeVowelSignA(str);
	return str;
}

/////////////////////
//
// MAIN
//
/////////////////////
var str = process.argv[2];
console.log("ORIGINAL: " + str);
console.log("CONVERTED:");

//
// Currently all the regexes handle the expected cases where capital letters would be found.
// Using toLowerCase is still conceivably a better approach, as it would handle all cases, even
// places where capitals are not expected but for strange reasons occur, etc. ... :
//
//str = toLowerCase(str); 

// Get rid of all accent and vowel length diacritics:
str = asciifyVowels(str);
//
// Perform certain pre-conversions such as recognizing that the "u" in words like "Culhuacan" is really an "o":
// => This step is really crucial for handling spelling and orthographic variants, including correct handling
//    of some aspects of the modern SEP orthography
//
str = preConversions(str);
// Convert digraphs such as "ch", "tz", "tl", etc., to the abugida form:
str = convertDigraphs(str);
// Convert remaining consonants to the abugida form:
str = convertSingleConsonants(str);
// Convert vowels to the abugida form:
str = convertVowels(str);
// Save the "raw form" since this might be easier to process for back-conversions:
rawForm =str;
console.log("RAW FORM:");
console.log(rawForm);
// Structure according to the abugida rules into final readable form with vowel signs and subjoined consonants:
console.log("FINAL FORM:");
str = structure(str);

console.log(str);

return 0;

