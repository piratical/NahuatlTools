//////////////////////////////////////////////////
//
// ca.cpp (c) 2017 by Edward H. Trager
//         ALL RIGHTS RESERVED
//
// Released under the GNU General Public License
// Version 2 or later.
//
// SYNOPSIS: ca removes accent marks from a  Nahuatl text.
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
	rer(target," ̄","");  // combining macron
	rer(target,"ā","a"); // a with combining macron
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
// main
//
int main(int argc, const char *argv[]){
	
	if(argc !=2){
		std::cerr << "ca: Remove long vowel diacritics from a Nahuatl source text" << std::endl;
		std::cerr << "     (c) 2017 by Edward H. Trager. All Rights Reserved" << std::endl;
		std::cerr << std::endl;
		std::cerr << "ca: Herramienta para eliminar marcas diacríticas en un texto en náhuatl " << std::endl;
		std::cerr << std::endl;
		std::cerr << "Derechos de autor (c) 2017 por Edward H. Trager. Todos los derechos reservados." << std::endl;
		std::cerr << std::endl;
		std::cerr << "GPL v. 2.0 or later. Licencia Pública General de GNU v. 2.0 o posterior" << std::endl;
		std::cerr << std::endl;
		std::cerr << "Usage: " << argv[0] << " <file to convert>" << std::endl;
		exit(1);
	}
	
	std::string target;
	std::ifstream file1(argv[1]);
	while (std::getline(file1,target)){
		
		// remove any long or accented vowels:
		asciifyVowels(target);
		
		std::cout << target << std::endl;
	}
	return 0;
}

