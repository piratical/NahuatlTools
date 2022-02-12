#include <sstream>
#include <string>
#include <fstream>
#include <iostream>
#include <stdlib.h>

int main(int argc, const char *argv[]){
	if(argc!=2){
		std::cerr << "addcr is copyright (c) 2021 by Ed Trager and released under GPL 2.0." << std::endl;
		std::cerr << "Usage: addcr <file>" << std::endl;
		std::cerr << "Results are printed to stdout, which you can redirect into a file, etc." << std::endl;
		exit(1);
	}
	
	std::ifstream file(argv[1]);
	std::string line;
	
	const char cr='\n';
	const char *c;
	const int idealLineLength=55;
	int i=0;
	
	while (std::getline(file,line)){
		
		for(i=0,c=line.c_str();*c!='\0';c++,i++){
			
			if(i>=idealLineLength && *c==' '){
				std::cout << '\n';
				// reset i back to zero:
				i=0;
			}else{
				std::cout << *c;
			}
		}
		// Make sure to retain CR at end of the original line:
		std::cout << '\n';
	}
	
	return 0;
}

