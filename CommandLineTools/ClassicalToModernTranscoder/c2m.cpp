//////////////////////////////////////////////////
//
// c2m.cpp (c) 2016 by Edward H. Trager
//         ALL RIGHTS RESERVED
//
// Released under the GNU General Public License
// Version 2 or later.
//
// SYNOPSIS: c2m converts Nahuatl text in the
// classical orthography to Nahuatl text in the
// modern SEP orthography.
//
////////////////////////////////////////////////////

#include <iostream>
#include <iterator>
#include <regex>
#include <string>
#include <algorithm>
#include <fstream>
#include <iostream>
#include <locale>

//
// rer: regular expression replace
//
void rer(std::string &target,const char *regexRule,const char *replace){
	std::regex regexp(regexRule);
	std::string replacement(replace);
	target=regex_replace(target,regexp,replacement);
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
	std::locale loc;
	for(std::string::size_type i=0; i<target.length();++i){
		target[i]=std::tolower(target[i],loc);
	}
	//
	//std::transform(target.begin(),target.end(),target.begin(),::tolower);
	//
}


//
// main
//
int main(int argc, const char *argv[]){
	
	if(argc !=2){
		std::cerr << "c2m: Convert Nahuatl text from classical to modern orthography." << std::endl;
		std::cerr << "     (c) 2016 by Edward H. Trager. All Rights Reserved" << std::endl;
		std::cerr << std::endl;
		std::cerr << "c2m: Herramienta para convertir texto en náhuatl desde la ortografía clásica" << std::endl;
		std::cerr << "     a la ortografía moderna." << std::endl;
		std::cerr << std::endl;
		std::cerr << "Derechos de autor (c) 2016 por Edward H. Trager. Todos los derechos reservados." << std::endl;
		std::cerr << std::endl;
		std::cerr << "GPL v. 2.0 or later. Licencia Pública General de GNU v. 2.0 o posterior" << std::endl;
		std::cerr << std::endl;
		std::cerr << "Usage: " << argv[0] << " <file to convert>" << std::endl;
		exit(1);
	}
	
	std::string target;
	std::ifstream file1(argv[1]);
	while (std::getline(file1,target)){
		// work on lowercase:
		toLowerCase(target);
		// remove any long or accented vowels:
		asciifyVowels(target);
		//
		// Convert classical to modern orthography:
		// We are using http://aulex.org's version of the modern orthography as the standard
		// In this version, "hu" -> "u", not "w"
		//
		
		// convert "ch" to protect it from
		// conversion of the "c" or the "h" separately:
		rer(target,"ch","ç");
		// Do digraph conversions first:
		rer(target,"hu","u");
		rer(target,"uh","u");
		rer(target,"qu","k");
		rer(target,"tz","ts");
		rer(target,"ce","se");
		rer(target,"ci","si");
		rer(target,"cu","ku");
		rer(target,"uc","ku");
    // 2019.07.02.et addendum: Actual usage of SEP-style orthography by
    // nahua-hablantes seems to be to maintain the spelling of both "l"s,
    // so this should is now commented out:
		// Geminated ll to single l:
		// rer(target,"ll","l");
		// Non-digraph conversions:
		rer(target,"c","k");
		rer(target,"h","j");
		rer(target,"z","s");
		// Reverse the "ch"->"ç" conversion:
		rer(target,"ç","ch");
		
		std::cout << target << std::endl;
	}
	return 0;
}

