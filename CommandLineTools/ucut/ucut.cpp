#include <sstream>
#include <string>
#include <fstream>
#include <iostream>
#include <stdlib.h>

int main(int argc, const char *argv[]){
	if(argc!=3){
		std::cerr << "ucut is copyright (c) 2016 by Ed Trager and released under GPL 2.0." << std::endl;
		std::cerr << "Usage: ucut <column number> file" << std::endl;
		exit(1);
	}
	
	int selectedColumn=atoi(argv[1]);
	selectedColumn--;
	
	int currentColumn;
	
	std::ifstream file(argv[2]);
	std::string line;
	
	const char delimiter='\t';
	const char *c;
	while (std::getline(file,line)){
		
		for(currentColumn=0,c=line.c_str();*c!='\0';c++){
			if(*c==delimiter){
				++currentColumn;
				if(*c!='\0'){
					++c;
				}
			}
			if(currentColumn>selectedColumn){
				break;
			}
			if(currentColumn==selectedColumn){
				std::cout << *c;
			}
		}
		std::cout << std::endl;
	}
	return 0;
}

