#include <iostream>
#include <iterator>
#include <regex>
#include <string>
#include <algorithm>
#include <map>
#include "UTF8String.h"


/////////////////////////////////////////////////////////////
//
// Current pre-Unicode code assignments in NahuatlOne font:
//
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
//
// UTF32 CODE POINT ASSIGNMENTS
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

// Vowels:
const UTF32 vowelA         = 0xED90;
const UTF32 vowelE         = 0xED91;
const UTF32 vowelI         = 0xED92;
const UTF32 vowelO         = 0xED93;
const UTF32 vowelU         = 0xED94;

// Long Vowel Sign:
const UTF32 longVowelSign  = 0xED95;

// Vowel Signs:
const UTF32 vowelSignA     = 0xEDA0;
const UTF32 vowelSignE     = 0xEDA1;
const UTF32 vowelSignI     = 0xEDA2;
const UTF32 vowelSignO     = 0xEDA3;
const UTF32 vowelSignU     = 0xEDA4;

// Native Consonants:
const UTF32 consonantMA    = 0xEDB0;
const UTF32 consonantNA    = 0xEDB1;
const UTF32 consonantPA    = 0xEDB2;
const UTF32 consonantTA    = 0xEDB3;
const UTF32 consonantCA    = 0xEDB4;
const UTF32 consonantCUA   = 0xEDB5;
const UTF32 consonantTZA   = 0xEDB6;
const UTF32 consonantTLA   = 0xEDB7;
const UTF32 consonantCHA   = 0xEDB8;
const UTF32 consonantSA    = 0xEDB9;
const UTF32 consonantXA    = 0xEDBA;
const UTF32 consonantHA    = 0xEDBB;
const UTF32 consonantLA    = 0xEDBC;
const UTF32 consonantWA    = 0xEDBE;   // Note WA WITZITZILIN (HUITZITZILIN) should come before YA in sorted order
const UTF32 consonantYA    = 0xEDBD;   // Note YA YOHUALLI should be the last letter in the native consonant series

// Additional Spanish Consonants:
const UTF32 consonantNYA   = 0xEDC0;
const UTF32 consonantBVA   = 0xEDC1;
const UTF32 consonantDA    = 0xEDC2;
const UTF32 consonantGA    = 0xEDC3;
const UTF32 consonantFA    = 0xEDC4;
const UTF32 consonantRA    = 0xEDC5;
const UTF32 consonantRRA   = 0xEDC6;

// Compound (Dipthong) Vowel Signs:
const UTF32 vowelSignIA    = 0xEDA5;
const UTF32 vowelSignAI    = 0xEDA6;
const UTF32 vowelSignOA    = 0xEDA7;
const UTF32 vowelSignEO    = 0xEDA8;
const UTF32 vowelSignEI    = 0xEDA9;

// Subjoiner sign:
const UTF32 subjoinerSign  = 0xEDAB;

// Special Prefix signs:
const UTF32 prefixPlace = 0xEDAD;
const UTF32 prefixName  = 0xEDAE;
const UTF32 prefixDiety = 0xEDAF;
///////////////////////////////////////////////
//
// END OF CODE POINT ASSIGNMENTS
//
////////////////////////////////////////////////


// Atomic vowels in UTF8 with char* references:
const UTF8String UTF8vowelA(vowelA);
const UTF8String UTF8vowelE(vowelE);
const UTF8String UTF8vowelI(vowelI);
const UTF8String UTF8vowelO(vowelO);
const UTF8String UTF8vowelU(vowelU);
const char *a = UTF8vowelA.c_str();
const char *e = UTF8vowelE.c_str();
const char *i = UTF8vowelI.c_str();
const char *o = UTF8vowelO.c_str();
const char *u = UTF8vowelU.c_str();

// Native Consonants in UTF8 with char * references:
const UTF8String UTF8consonantMA(consonantMA);
const UTF8String UTF8consonantNA(consonantNA);
const UTF8String UTF8consonantPA(consonantPA);
const UTF8String UTF8consonantTA(consonantTA);
const UTF8String UTF8consonantCA(consonantCA);
const UTF8String UTF8consonantCUA(consonantCUA);
const UTF8String UTF8consonantTZA(consonantTZA);
const UTF8String UTF8consonantTLA(consonantTLA);
const UTF8String UTF8consonantCHA(consonantCHA);
const UTF8String UTF8consonantSA(consonantSA);
const UTF8String UTF8consonantXA(consonantXA);
const UTF8String UTF8consonantHA(consonantHA);
const UTF8String UTF8consonantLA(consonantLA);
const UTF8String UTF8consonantWA(consonantWA);
const UTF8String UTF8consonantYA(consonantYA);
const char *ma  = UTF8consonantMA.c_str();
const char *na  = UTF8consonantNA.c_str();
const char *pa  = UTF8consonantPA.c_str();
const char *ta  = UTF8consonantTA.c_str();
const char *ca  = UTF8consonantCA.c_str();
const char *cua = UTF8consonantCUA.c_str();
const char *tza = UTF8consonantTZA.c_str();
const char *tla = UTF8consonantTLA.c_str();
const char *cha = UTF8consonantCHA.c_str();
const char *sa  = UTF8consonantSA.c_str();
const char *xa  = UTF8consonantXA.c_str();
const char *ha  = UTF8consonantHA.c_str();
const char *la  = UTF8consonantLA.c_str();
const char *wa  = UTF8consonantWA.c_str();
const char *ya  = UTF8consonantYA.c_str();

// Non-native consonants in UTF8 with char * references:
const UTF8String UTF8consonantNYA(consonantNYA);
const UTF8String UTF8consonantBVA(consonantBVA);
const UTF8String UTF8consonantDA(consonantDA);
const UTF8String UTF8consonantGA(consonantGA);
const UTF8String UTF8consonantFA(consonantFA);
const UTF8String UTF8consonantRA(consonantRA);
const UTF8String UTF8consonantRRA(consonantRRA);
const char *nya = UTF8consonantNYA.c_str();
const char *bva = UTF8consonantBVA.c_str();
const char *da  = UTF8consonantDA.c_str();
const char *ga  = UTF8consonantGA.c_str();
const char *fa  = UTF8consonantFA.c_str();
const char *ra  = UTF8consonantRA.c_str();
const char *rra = UTF8consonantRRA.c_str();

// Atomic vowel signs in UTF8 with char * references:
const UTF8String UTF8vowelSignA(vowelSignA);
const UTF8String UTF8vowelSignE(vowelSignE);
const UTF8String UTF8vowelSignI(vowelSignI);
const UTF8String UTF8vowelSignO(vowelSignO);
const UTF8String UTF8vowelSignU(vowelSignU);
const char *sign_a = UTF8vowelSignA.c_str();
const char *sign_e = UTF8vowelSignE.c_str();
const char *sign_i = UTF8vowelSignI.c_str();
const char *sign_o = UTF8vowelSignO.c_str();
const char *sign_u = UTF8vowelSignU.c_str();

// Combined vowel signs in UTF8 with char * references:
const UTF8String UTF8vowelSignIA(vowelSignIA);
const UTF8String UTF8vowelSignAI(vowelSignAI);
const UTF8String UTF8vowelSignOA(vowelSignOA);
const UTF8String UTF8vowelSignEO(vowelSignEO);
const UTF8String UTF8vowelSignEI(vowelSignEI);
const char *sign_ia = UTF8vowelSignIA.c_str();
const char *sign_ai = UTF8vowelSignAI.c_str();
const char *sign_oa = UTF8vowelSignOA.c_str();
const char *sign_eo = UTF8vowelSignEO.c_str();
const char *sign_ei = UTF8vowelSignEI.c_str();

// Name prefixes:
const UTF8String UTF8prefixPlace(prefixPlace);
const UTF8String UTF8prefixName(prefixName);
const UTF8String UTF8prefixDiety(prefixDiety);
const char *place_prefix = UTF8prefixPlace.c_str();
const char *name_prefix  = UTF8prefixName.c_str();
const char *diety_prefix = UTF8prefixDiety.c_str();

// Additional required replacement strings:
const char *s_se("");   // converts ce to /se/ consonant
const char *s_si("");   // converts ci to /si/ consonant
const char *s_he("e");
const char *s_hi("i");
const char *s_wa("a");

// Consonant and Vowel lists:
const std::basic_string<UTF32> consonantList(UTF8String("").UTF32String());
const std::basic_string<UTF32> vowelList(UTF8String("").UTF32String());
const std::basic_string<UTF32> vowelSignList(UTF8String("").UTF32String());


//
// vowelToVowelSign
//
UTF32 vowelToVowelSign(UTF32 vowel){
	
	switch(vowel){
	case vowelA:
		return vowelSignA;
	case vowelE:
		return vowelSignE;
	case vowelI:
		return vowelSignI;
	case vowelO:
		return vowelSignO;
	case vowelU:
		return vowelSignU;
	}
	// Should never get here:
	return vowel;
}

//
// exchangeCompoundVowels
//
void exchangeCompoundVowels(std::basic_string<UTF32> &target,unsigned pos,UTF32 vowelSign,UTF32 vowel){
	
	std::basic_string<UTF32> replacement;
	
	if(vowelSign==vowelSignI && vowel==vowelA){
		replacement=vowelSignIA;
		target.replace(pos,2,replacement);
	}else if(vowelSign==vowelSignA && vowel==vowelI){
		replacement=vowelSignAI;
		target.replace(pos,2,replacement);
	}else if(vowelSign==vowelSignO && vowel==vowelA){
		replacement=vowelSignOA;
		target.replace(pos,2,replacement);
	}else if(vowelSign==vowelSignE && vowel==vowelO){
		replacement=vowelSignEO;
		target.replace(pos,2,replacement);
	}else if(vowelSign==vowelSignE && vowel==vowelI){
		replacement=vowelSignEI;
		target.replace(pos,2,replacement);
	}
	// If we get here, then there is no replacement for
	// the vowel combination, so nothing happens ...
}


//
// rer: regular expression replace
//
void rer(std::string &target,const char *regexRule,const char *replacement){
	std::regex regexp(regexRule);
	std::string replace(replacement);
	target=regex_replace(target,regexp,replace);
}

//
// convertDigraphs
//
void convertDigraphs(std::string &target){
	rer(target,"cuh",cua);   // converts cuh to /kʷ/ consonant
	rer(target,"hu",wa);     // converts hu to /w/  consonant; do this *before* ch conversion to prevent misconversion of "ichui" etc.
	rer(target,"uh",wa);     // converts uh to /w/  consonant
	rer(target,"qu",ca);     // converts qu to /k/  consonant
	rer(target,"cu",cua);    // converts cu to /kʷ/ consonant
	rer(target,"ce",s_se);   // converts ce to /se/ consonant
	rer(target,"ci",s_si);   // converts ci to /si/ consonant
	rer(target,"ku",cua);    // converts ku to /kʷ/ consonant <= ortografía moderna*
	rer(target,"kw",cua);    // converts ku to /kʷ/ consonant <= variente de la ortografía moderna*
	rer(target,"uc",cua);    // converts uc to /kʷ/ consonant
	rer(target,"tz",tza);    // converts tz to /t͡s/ consonant
	rer(target,"ts",tza);    // converts ts to /t͡s/ consonant
	rer(target,"tl",tla);    // converts tl to /t͡ɬ/ consonant
	rer(target,"ch",cha);    // converts ch to /t͡ʃ/ consonant
	rer(target,"rr",rra);    // converts rr to trilled /r/ consonant
	// This could be an option:
	rer(target,"ll",la);     // converts geminated ll to geminated /l/ consonant
	// The following are Spanish-specific: ge and gi need to become /he/ and /hi/
	// (not /ge/ and /gi/) and jua needs to become /wa/. The vowels remain Latin
	// at this point so that the rest of the processing pipeline will function
	// correctly:
	rer(target,"ge",s_he);
	rer(target,"gi",s_hi);
	rer(target,"jua",s_wa);
}

//
// convertSingleConsonants
//
void convertSingleConsonants(std::string &target){
	
	rer(target,"m",ma);
	rer(target,"n",na);
	rer(target,"p",pa);
	rer(target,"t",ta);
	rer(target,"c",ca);
	rer(target,"k",ca); // ortografía moderna
	rer(target,"s",sa); // ortografía moderna
	rer(target,"z",sa);
	rer(target,"x",xa);
	rer(target,"h",ha);
	rer(target,"j",ha); // ortografía moderna
	rer(target,"l",la);
	rer(target,"y",ya);
	rer(target,"w",wa);
	rer(target,"ñ",nya);
	rer(target,"v",bva);
	rer(target,"b",bva);
	rer(target,"d",da);
	rer(target,"g",ga);
	rer(target,"f",fa);
	rer(target,"r",ra);
}

//
// convertVowels
//
void convertVowels(std::string &target){
	
	rer(target,"a",a);
	rer(target,"e",e);
	rer(target,"i",i);
	rer(target,"o",o);
	rer(target,"u",u);   // `u' only occurs in foreign words in the classical orthography
}

//
// asciifyVowels
//
void asciifyVowels(std::string &target){
	//rer(target,"[āáàäâã]","a");
	rer(target,"ā","a");
	rer(target,"á","a");
	rer(target,"à","a");
	rer(target,"ä","a");
	rer(target,"â","a");
	rer(target,"ã","a");
	//rer(target,"[éēèëê]" ,"e");
	rer(target,"é","e");
	rer(target,"ē","e");
	rer(target,"è","e");
	rer(target,"ë","e");
	rer(target,"ê","e");
	//rer(target,"[íīìïî]" ,"i");
	rer(target,"í","i");
	rer(target,"ī","i");
	rer(target,"ì","i");
	rer(target,"ï","i");
	rer(target,"î" ,"i");
	//rer(target,"[ōóòöôõ]","o");
	rer(target,"ō","o");
	rer(target,"ó","o");
	rer(target,"ò","o");
	rer(target,"ö","o");
	rer(target,"ô","o");
	rer(target,"õ","o");
	//rer(target,"[ūúùüû]" ,"u");
	rer(target,"ū" ,"u");
	rer(target,"ú" ,"u");
	rer(target,"ù" ,"u");
	rer(target,"ü" ,"u");
	rer(target,"û" ,"u");
}

//
// toLowerCase
//
void toLowerCase(std::string &target){
	
	std::transform(target.begin(),target.end(),target.begin(),::tolower);
	
}



bool isConsonant(const UTF32 elem){
	return consonantList.find(elem)!=std::basic_string<UTF32>::npos;
}

bool isVowel(const UTF32 elem){
	return vowelList.find(elem)!=std::basic_string<UTF32>::npos;
}

bool isVowelSignA(const UTF32 elem){
	return elem==vowelSignA;
}

bool isVowelU(const UTF32 elem){
	return elem==vowelU;
}


bool isVowelSign(const UTF32 elem){
	return vowelSignList.find(elem)!=std::basic_string<UTF32>::npos;
}

bool isLongVowelIndicator(const UTF32 elem){
	return elem==longVowelSign;
}

bool isNotAbugida(const UTF32 elem){
	return !(isConsonant(elem) || isVowel(elem) || isLongVowelIndicator(elem));
}

//////////////////////////////////////////////////////
//
// makeSubjoined(): prefixes a consonant letter with 
//                 the subjoiner character
//
//////////////////////////////////////////////////////
std::basic_string<UTF32> makeSubjoined(UTF32 elem){
	std::basic_string<UTF32> target;
	target.push_back(subjoinerSign);
	target.push_back(elem);
	return target;
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
UTF8String structure(const UTF8String &target){
	
	std::basic_string<UTF32> elem(target.UTF32String());
	
	std::basic_string<UTF32> subjoinerString{};
	subjoinerString.push_back(subjoinerSign);
	
	
	UTF32 first;
	UTF32 second;
	UTF32 third;
	UTF32 fourth;
	
	unsigned int lastPosition = elem.length()-1;
	//
	// Phase Zero: This is a pre-phase for
	// dealing with the modern orthography where a 'u' is a /w/
	// when found between two vowels:
	//
	for(unsigned int i=0;elem[i];i++){
		
		// first:
		first = elem[i];
		// second:
		if(i+1 <= lastPosition){
			second = elem[i+1];
		}else{
			second = 0x0000;
		}
		// third:
		if(i+2 <= lastPosition){
			third = elem[i+2];
		}else{
			third = 0x0000;
		}
		if(isVowel(first) && isVowelU(second) && isVowel(third)){
			elem[i+1]=consonantWA;
		}
	}
	
	
	//
	// First phase:
	//
	
	
	for(unsigned int i=0;elem[i];i++){
		
		// first:
		first = elem[i];
		// second:
		if(i+1 <= lastPosition){
			second = elem[i+1];
		}else{
			second = 0x0000;
		}
		// third:
		if(i+2 <= lastPosition){
			third = elem[i+2];
		}else{
			third = 0x0000;
		}
		// fourth:
		if(i+3 <= lastPosition){
			fourth = elem[i+3];
		}else{
			fourth = 0x0000;
		}
		//
		// DEBUG:
		// std::cout << ">>> Quartet at " << i << " is " << std::hex << first << " " << second << " " << third << " " << fourth << std::endl ;
		//
		
		if(isConsonant(first) && isVowel(second)){
			elem[i+1] = vowelToVowelSign(second);
			// DEBUG:
			//std::cout << ">>> Vowel " << std::hex << second << " converted to " << elem[i+1] << std::endl;
			//UTF8String temp(elem);
			//std::cout << ">>> " << temp << std::endl;
			
			if( isConsonant(third) && (isNotAbugida(fourth) || isConsonant(fourth)) ){
				elem.insert(i+2,subjoinerString); // = makeSubjoined($third);
				// Because we've added a character, the string is now longer than before,
				// so get a new lastPosition and we can also increment i by one:
				lastPosition = elem.length()-1;
				i++;
				// DEBUG:
				//std::cout << ">*> SUBJOINED AT " << std::dec << i << " with length now=" << elem.length() << std::endl;
				//UTF8String temp(elem);
				//std::cout << ">*> " << temp << std::endl;
			}
		}
		
		
		//
		// remaining vowels with trailing consonants:
		//
		if( (isVowel(first) || isLongVowelIndicator(first)) 
		    && isConsonant(second) 
		    && (isNotAbugida(third) || isConsonant(third)) 
		){
			elem.insert(i+1,subjoinerString); // = makeSubjoined($second);
			// Because we've added a character, the string is now longer than before,
			// so get a new lastPosition and we can also increment i by one:
			lastPosition = elem.length()-1;
			i++;
			// DEBUG:
			//std::cout << "**> SUBJOINED II AT " << std::dec << i << " with length now=" << elem.length() << std::endl;
			//UTF8String temp(elem);
			//std::cout << "**> " << temp << std::endl;
		}
	}
	
	//
	// Convert vowel sign + vowel to dipthong vowel signs:
	//
	for(unsigned i=0;elem[i];i++){
		
		first = elem[i];
		
		if(i+1 <= lastPosition){
			second = elem[i+1];
		}else{
			second = 0x0000;
		}
		
		if(isVowelSign(first) && isVowel(second)){
			exchangeCompoundVowels(elem,i,first,second);
			// Now we have possibly made the string shorter again, so update lastPosition:
			lastPosition = elem.length()-1;
		}
	}
	//
	// Remove above-base vowel sign /a/s as they are redundant
	// in non-educational, non-didactic contexts:
	//
	for(unsigned int i=0;elem[i];i++){
		if(elem[i]==vowelSignA){
			elem.erase(i,1);
		}
	}
	
	UTF8String utf8_result(elem);
	return utf8_result;
}



///////////////////////////////////////////
//
// main
//
///////////////////////////////////////////
int main(int argc, const char *argv[]){
	
	if(argc !=2){
		std::cerr << "Usage: " << argv[0] << " <phrase to convert " << std::endl;
		exit(1);
	}
	
	std::string target(argv[1]);
	
	toLowerCase(target);
	//std::cout << "toLowerCase(): " << target << std::endl;
	asciifyVowels(target);
	//std::cout << "asciifyVowels(): " << target << std::endl;
	convertDigraphs(target);
	//std::cout << "convertDigraphs(): " << target << std::endl;
	convertSingleConsonants(target);
	//std::cout << "convertSingleConsonants(): " << target << std::endl;
	convertVowels(target);
	//std::cout << "convertVowels(): " << target << std::endl;
	std::cout << structure((UTF8String)target) << std::endl;
	return 0;
}

