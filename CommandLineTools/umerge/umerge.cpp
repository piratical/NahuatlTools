#include <sstream>
#include <string>
#include <fstream>
#include <iostream>

int main(int argc, const char *argv[]){
	if(argc<3){
		std::cerr << "umerge is copyright (c) 2016 by Ed Trager and released under GPL 2.0." << std::endl;
		std::cerr << "Usage: umerge file1 file2 <optional_prefix>" << std::endl;
		exit(1);
	}
	bool hasPrefix=false;
	std::string prefix;
	if(argc==4){
		hasPrefix=true;
		prefix=argv[3];
	}
	
	std::ifstream file1(argv[1]);
	std::ifstream file2(argv[2]);
	std::string line1;
	std::string line2;
	
	while (std::getline(file1, line1)){
		
		std::getline(file2,line2);
		if(hasPrefix){
			std::cout << prefix << "\t" << line1 << "\t" << line2 << std::endl;
		}else{
			std::cout << line1 << "\t" << line2 << std::endl;
		}
	}
	return 0;
}

