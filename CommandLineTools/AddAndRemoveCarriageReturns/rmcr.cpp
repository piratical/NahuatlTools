#include <sstream>
#include <string>
#include <fstream>
#include <iostream>
#include <stdlib.h>

int main(int argc, const char *argv[]){
	if(argc!=2){
		std::cerr << "rmcr is copyright (c) 2021 by Ed Trager and released under GPL 2.0." << std::endl;
		std::cerr << "Usage: rmcr <file>" << std::endl;
		std::cerr << "Results are printed to stdout, which you can redirect into a file, etc." << std::endl;
		exit(1);
	}
	
	std::ifstream file(argv[1]);
	std::string line;
	
	const char cr='\n';
	const char *c;
	const int idealLineLength=55;
	int i=0;
	
	std::string lastLine;
	
	while(std::getline(file,line)){
		if(line.empty()){
			std::cout << '\n';
			std::cout << '\n';
		}else{
			if(lastLine.length() && lastLine.back()!=' '){
				// Add a space between joined lines as necessary:
				std::cout << ' ';
			}
			std::cout << line;
		}
		// Keep a reference to the previous line to inspect on next iteration:
		lastLine = line;
	}
	
	return 0;
}

