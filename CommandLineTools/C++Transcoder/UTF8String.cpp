/////////////////////////////////////////////////////////
//
// A version of this file was originally part of the 
// MADELINE 2 program and Font Playground.
//
// (c) 2016 by Edward H. Trager
//   
// Released under the GNU General Public License.
// A copy of the GPL is included in the distribution
// package of this software, or see:
// 
//   http://www.gnu.org/copyleft/
//   
// ... for licensing details.
// 
/////////////////////////////////////////////////////////
//
// Utf8String.cpp
//
// LAST UPDATE: 2016.07.12
//

#include "UTF8String.h"

#include <string>

// DEBUG:
#include <iostream>
#include <iomanip>
using namespace std;

// Constructors:
UTF8String::UTF8String(): std::string(){}

// Copy Constructors:
UTF8String::UTF8String(const std::string &s): std::string(s){}
UTF8String::UTF8String(const UTF8String &s): std::string(s){}

///
/// unicodeLength()
///
/// This function tells you the "length" of
/// a UTF8 string in terms of the number of 
/// Unicode code points (values) encoded in the
/// UTF-8 string.  Since all UTF-8 continuation
/// bytes have the pattern "10xxxxxx"
/// (hence the mask 0x00C0), counting
/// only those bytes that are not continuation
/// bytes (hence "!=0x0080) directly provides 
/// the number of encoded code points:
///
unsigned int UTF8String::unicodeLength() const {
	
	unsigned int i;
	const char *s;
	for(i=0 , s=this->c_str() ; *s ; s++ ){
		
		if( (*s & 0x00C0) != 0x0080) i++;
		
	}
	return i;
	
}

//
// unicodeSubString()
//
UTF8String UTF8String::unicodeSubstr(unsigned int stt,unsigned int howManyCharacters) const {
	
	// stt is zero-offset, so for this algorithm we add one:
	stt++;
	
	unsigned int byteStart=0;
	unsigned int byteEnd;
	bool foundStart=false;
	unsigned int i,j;
	const char *s;
	
	unsigned int end;
	//
	// "end=0" signifies "remainder of string"
	//
	if(!howManyCharacters) end=0;
	else                   end=stt+howManyCharacters;
	
	//
	// j is byte count while i is character count:
	//
	for(i=j=0 , s=this->c_str() ; *s ; s++,j++ ){
		//
		// i counts unicode characters:
		//
		if( (*s & 0x00C0) != 0x0080 ) i++;
		//
		// Handle beginning of substring:
		//
		if(!foundStart && i==stt){
			byteStart=j;
			foundStart=true;
			//
			// If end is undefined, return the
			// remainder of the string:
			//
			if(!end) return (UTF8String) this->substr(byteStart);
			
		}
		//
		// Get here if we need to look 
		// for the end of the substring:
		//
		if(i==end){
			for(unsigned int k=j;*s;s++,k++){
				if( (*s & 0x00C0) != 0x0080 ){
					byteEnd=k; // byteEnd could be optimized out: here for code clarity
					return (UTF8String) this->substr(byteStart,byteEnd-byteStart);
				}
			}
		}
		
	}
	if(!foundStart) return UTF8String("ERROR: Start after end of string!");
	return (UTF8String) this->substr(byteStart);
}

//
// This is a read-only brackets operator ... 
//
UTF8String UTF8String::operator[](unsigned int pos) const {
	
	return unicodeSubstr(pos,1);
	
}

///
/// unicodeValueAtPosition():
///
/// Note: The code in this method was inspired by a UTF8ToUTF32 method
/// in the GPL'ed swunicod.cpp (c) 1998 by the CrossWire Bible Society 
/// (http://www.crosswire.org).  It differs a bit from the method presented
/// by the Unicode Consortium which relies on some static lookup-tables.
///
UTF32 UTF8String::unicodeValueAtPosition(unsigned int pos) const {
	
	pos++;
	if(!pos) return 0;
	
	UTF8String u = this->unicodeSubstr(pos,1);
	const char *utf8 = u.c_str();
	
	unsigned char count;
	unsigned char firstByte=*utf8;
	//
	// Count how many high bits are set to 1, stopping
	// when we get to a 0 bit:
	//
	for(count=0; firstByte & 0x80;count++,firstByte<<=1);
	//
	// ASCII case:
	//
	if(!count) return (UTF32) utf8[0];
	//
	// NOT Legal UTF8 case:
	//
	if(count==1) return UNI_REPLACEMENT_CHAR;
	////////////////////////////////////////////
	//
	// Get here if there are continuation bytes:
	//
	////////////////////////////////////////////
	UTF32 utf32;
	utf8++;
	//
	// Unshift the firstByte, now without the high-bit flags,
	// and put those bits into utf32:
	//
	utf32 = (firstByte >> count);
	//
	// Add the six low bits from each continuation byte:
	//
	while(*utf8){
		utf32 <<=6;
		utf32 |= (*utf8 & 0x3f);
		utf8++;
	}
	//
	// Done!
	//
	return utf32;
	
}

///
/// UTF32String(): Converts a UTF8String to a UTF32String
///
std::basic_string<UTF32> UTF8String::UTF32String() const {
	
	std::basic_string<UTF32> utf32String;
	UTF32 utf32Value;
	
	unsigned int i; // Counts unicode values
	const char *s;
	unsigned char count;
	unsigned char firstByte;
	
	for(i=0 , s=this->c_str() ; *s ; ){
		
		if( (*s & 0x00C0) != 0x0080){
			
			firstByte=*s;
			
			//
			// Count how many high bits are set to 1, stopping
			// when we get to a 0 bit:
			//
			for(count=0; firstByte & 0x80;count++,firstByte<<=1);
			
			//
			// ASCII case:
			//
			if(!count){
				
				utf32String += (UTF32) *s++;
				
			}else if (count==1){
				//
				// NOT Legal UTF8 case:
				//
				
				utf32String += (UTF32) UNI_REPLACEMENT_CHAR;
				return utf32String;
				
			}else{
				////////////////////////////////////////////
				//
				// Get here if there are continuation bytes:
				//
				////////////////////////////////////////////
				s++;
				//
				// Unshift the firstByte, now without the high-bit flags,
				// and put those bits into utf32:
				//
				utf32Value = (firstByte >> count);
				//
				// Add the six low bits from each continuation byte:
				//
				--count;
				for(;count;count--){
					utf32Value <<=6;
					utf32Value |= (*s & 0x3f);
					s++;
				}
				//
				// Done with this value:
				//
				utf32String += utf32Value;
			}
			//
			// Increment i:
			//
			i++;
		}else{
			// Invalid UTF-8:
			utf32String += (UTF32) UNI_REPLACEMENT_CHAR;
			return utf32String;
		}
	}
	return utf32String;
}

//
// Private method: _UTF32ValueToUTF8
//
// This isn't the most compact way of doing it, but this code is
// easy to understand and fast:
//
const char *UTF8String::_UTF32ValueToUTF8( UTF32 UTF32Value ){
	
	//
	// Static buffer:
	//
	static unsigned char utf8[7];
	
	unsigned int k;
	
	// Clear out utf8 array:
	for(unsigned int j=0;j<7;j++) utf8[j]=0;
		
	if (UTF32Value < 0x80){
		utf8[0] = (char) UTF32Value;
	}else if (UTF32Value < 0x800){
		k = UTF32Value & 0x3f;
		utf8[1] = 0x80 | k;
		UTF32Value >>= 6;
		k = UTF32Value & 0x1f;
		utf8[0] = 0xc0 | k;
	}else if (UTF32Value < 0x10000){
		k = UTF32Value & 0x3f;
		utf8[2] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[1] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x0f;
		utf8[0] = 0xe0 | k;
	}else if (UTF32Value < 0x200000){
		k = UTF32Value & 0x3f;
		utf8[3] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[2] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[1] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x07;
		utf8[0] = 0xf0 | k;
	}else if (UTF32Value < 0x4000000) {
		k = UTF32Value & 0x3f;
		utf8[4] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[3] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[2] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[1] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x03;
		utf8[0] = 0xf8 | k;
	}else if (UTF32Value < 0x80000000) {
		k = UTF32Value & 0x3f;
		utf8[5] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[4] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[3] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[2] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x3f;
		utf8[1] = 0x80 | k;
		UTF32Value >>= 6;
		
		k = UTF32Value & 0x01;
		utf8[0] = 0xfc | k;
	}
	
	return (const char *) utf8;
	
}

//
// append(UTF32String)
//
UTF8String& UTF8String::append( const std::basic_string<UTF32> &UTF32String ){
	
	for(unsigned int i=0;i<UTF32String.size();i++){
		
		this->std::string::append( _UTF32ValueToUTF8( UTF32String[i] ));
		
	}
	return *this;
	
}

//
// append(UTF16String)
//
UTF8String& UTF8String::append( const std::basic_string<UTF16> &UTF16String){
	
	UTF32 ch;
	
	static const int halfShift  = 10; /* used for shifting by 10 bits */
	static const UTF32 halfBase = 0x0010000UL;
	
	for(unsigned int i=0;i<UTF16String.size();i++){
		
		ch = UTF16String[i];
		
		//
		// If we have a surrogate pair, convert to UTF32 first.
		//
		if (ch >= UNI_SUR_HIGH_START && ch <= UNI_SUR_HIGH_END){
			//
			// If the 16 bits following the high surrogate are in the source buffer:
			//
			if (i<UTF16String.size()-1){
				UTF32 ch2 = UTF16String[i+1];
				//
				// If it's a low surrogate, convert to UTF32:
				//
				if (ch2 >= UNI_SUR_LOW_START && ch2 <= UNI_SUR_LOW_END){
					ch = ((ch - UNI_SUR_HIGH_START) << halfShift)
					+ (ch2 - UNI_SUR_LOW_START) + halfBase;
				}
				i++;
			}
		}
		
		this->std::string::append( _UTF32ValueToUTF8(ch));
		
	}
	
	return *this;
	
}

//
// operator+=(UTF32)
//
UTF8String& UTF8String::operator+=( const std::basic_string<UTF32> &UTF32String ){
	
	this->append(UTF32String);
	return *this;
	
}

//
// operator+=(UTF16)
//
UTF8String& UTF8String::operator+=( const std::basic_string<UTF16> &UTF16String ){
	
	this->append(UTF16String);
	return *this;
	
}

//
// operator=(UTF32)
//
UTF8String& UTF8String::operator=( const std::basic_string<UTF32> &UTF32String ){
	
	this->clear();
	this->append(UTF32String);
	return *this;
	
}

//
// operator=(UTF16)
//
UTF8String& UTF8String::operator=( const std::basic_string<UTF16> &UTF16String ){
	
	this->clear();
	this->append(UTF16String);
	return *this;
	
}

//
// Construct a UTF8String from a basic_string<UTF32> string:
//
UTF8String::UTF8String( const basic_string<UTF32> &UTF32String ): std::string("") {
	
	this->append(UTF32String);
	
}

//
// Construct a UTF8 string from a UTF16String:
//
UTF8String::UTF8String( const std::basic_string<UTF16> & UTF16String ): std::string(""){
	
	this->append(UTF16String);
	
}

