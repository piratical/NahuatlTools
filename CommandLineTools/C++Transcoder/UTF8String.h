/////////////////////////////////////////////////////////
//
// An earlier version of this file was part of the 
// MADELINE 2 program and Font Playground.
// 
// (c) 2016 Edward H. Trager
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
// Utf8String.h
//
// LAST UPDATE: 2016.07.12
// 

#ifndef UTF8STRING_INCLUDED
#define UTF8STRING_INCLUDED

#include <string>

typedef unsigned long  UTF32; // at least 32 bits
typedef unsigned short UTF16; // at least 16 bits
typedef unsigned char  UTF8;

#define UNI_REPLACEMENT_CHAR (UTF32)0x0000FFFD
#define UNI_MAX_UTF32 (UTF32)0x7FFFFFFF

//
// The following are needed for UTF-16 conversion:
// 
#define UNI_SUR_HIGH_START  (UTF32)0xD800
#define UNI_SUR_HIGH_END    (UTF32)0xDBFF
#define UNI_SUR_LOW_START   (UTF32)0xDC00
#define UNI_SUR_LOW_END     (UTF32)0xDFFF

class UTF8String : public std::string {
	
	
private:
	
	const char *_UTF32ValueToUTF8( UTF32 UTF32Value );
	
public:
	
	// Default constructor just calls base class std::String():
	UTF8String();
	// Copy Constructors:
	UTF8String(const std::string &s);
	UTF8String(const UTF8String &s);
	// How many Unicode character code points are stored in the string?:
	unsigned int unicodeLength() const;
	
	// Get the Unicode substring starting at the "stt" unicode value --
	// stt=0 is the first character.
	UTF8String unicodeSubstr(unsigned int stt,unsigned int howManyCharacters=0) const;
	// Read-only bracket operator retrieves the nth unicode character --
	// Note that pos=0 specifies the first character:
	UTF8String operator[](unsigned int pos) const;
	
	// Return the Unicode code value of the nth Unicode character:
	UTF32 unicodeValueAtPosition(unsigned int pos=0) const;
		
	// Returns a UTF32 String:
	std::basic_string<UTF32> UTF32String() const;
	
	//
	// Append and Derived Overloaded Assignment operators:
	//
	UTF8String& append( const std::basic_string<UTF32> &UTF32String );
	UTF8String& append( const std::basic_string<UTF16> &UTF16String );
	
	UTF8String& operator+=( const std::basic_string<UTF32> &UTF32String );
	UTF8String& operator+=( const std::basic_string<UTF16> &UTF16String );
	
	UTF8String& operator=( const std::basic_string<UTF32> &UTF32String );
	UTF8String& operator=( const std::basic_string<UTF16> &UTF16String );
	
	// 
	// Specialized constructors:
	// 
	// Construct a UTF8String from a UTF32 or UTF16 string:
	// 
	// These also ultimately use the append() methods from above:
	// 
	UTF8String( const std::basic_string<UTF32> &UTF32String );
	UTF8String( const std::basic_string<UTF16> &UTF16String );
	
	//
	// Constructing UTF8Strings from a single code point:
	//
	UTF8String& append( const UTF32 code_point);
	UTF8String& operator+=(const UTF32 code_point);
	UTF8String& operator=(const UTF32 code_point);
	// Copy constructor specialized for a single code point:
	UTF8String( const UTF32 code_point );
	
};

#endif

