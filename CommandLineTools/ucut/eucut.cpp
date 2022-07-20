#include <sstream>
#include <string>
#include <fstream>
#include <iostream>
#include <stdlib.h>

int main(int argc, const char *argv[]){
	if(argc!=4){
		std::cerr << "eucut is copyright (c) 2016 by Ed Trager and released under GPL 2.0." << std::endl;
		std::cerr << "Usage: eucut <delimiter_name> <column number> file" << std::endl;
		exit(1);
	}
	
        std::string dlm(argv[1]);
        char delimiter='\0';
        if(dlm=="tabs"){
            delimiter='\t';
        }else if(dlm=="commas"){
            delimiter=',';
        }else if(dlm=="pipes"){
            delimiter='|';
        }
        
        if(!delimiter){
            std::cerr << "Unknown delimiter name" << std::endl;
            std::cerr << "Valid delimiter names are: commas tabs pipes" << std::endl;
		exit(1);
        }
	int selectedColumn=atoi(argv[2]);
	selectedColumn--;
	
	int currentColumn;
	
	std::ifstream file(argv[3]);
	std::string line;
	
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

