#!/opt/local/bin/perl

##########################################################
#
# transcode.pl (c) 2016 by Edward H. Trager
#                  ALL RIGHTS RESERVED
#
# THIS IS FREE SOFTWARE DISTRIBUTED UNDER THE TERMS OF
# THE GNU GENERAL PUBLIC LICENSE VERSION 2 OR LATER
# 
# PURPOSE: Converts Nahuatl in Latin script to
#          Nahuatl in Abugida script
#
# NOTES:   Input in TRADITIONAL orthography has been
#          tested.
#
###########################################################
use strict;
package Nahuatl::Transcode;
use base 'Exporter';
#
# Only EXPORTing the convert() function:
#
our @EXPORT_OK = ('convert');

use utf8;
use Encode;
binmode(STDIN,  ':utf8');
binmode(STDOUT, ':utf8');
binmode(STDERR, ':utf8');

###########################################################
#
# convertDigraphs(): Converts Latin tri- and di-graphs to 
#                    "atomic" letters in the Abugida
#
###########################################################
sub convertDigraphs {
	my $s = $_[0];
	my $l = $_[1] // 0; # 2nd parameter keep doubled (geminated) `l'
	$s =~ s/cuh//g;   # converts cuh to /kʷ/ consonant
	$s =~ s/hu//g;    # converts hu to /w/  consonant; do this *before* ch conversion to prevent misconversion of "ichui" etc.
	$s =~ s/uh//g;    # converts uh to /w/  consonant
#	$s =~ s/uh//g;    # converts uh to /h/  consonant: This is a possible alternate for modern Nahuatl, but /w/ (above) is probably more correct.
	$s =~ s/qu//g;    # converts qu to /k/  consonant
	$s =~ s/cu//g;    # converts cu to /kʷ/ consonant
	$s =~ s/ce//g;   # converts ce to /se/ consonant
	$s =~ s/ci//g;   # converts ci to /si/ consonant
	$s =~ s/ku//g;    # converts ku to /kʷ/ consonant <= ortografía moderna*
	$s =~ s/uc//g;    # converts uc to /kʷ/ consonant
	$s =~ s/tz//g;    # converts tz to /t͡s/ consonant
	$s =~ s/ts//g;    # converts ts to /t͡s/ consonant
	$s =~ s/tl//g;    # converts tl to /t͡ɬ/ consonant
	$s =~ s/ch//g;    # converts ch to /t͡ʃ/ consonant
	$s =~ s/rr//g;    # converts rr to trilled /r/ consonant
	if(!$l){
		$s =~ s/ll//g;    # converts geminated ll to geminated /l/ consonant
	}
	# The following are Spanish-specific: ge and gi need to become /he/ and /hi/
	# (not /ge/ and /gi/) and jua needs to become /wa/. The vowels remain Latin
	# at this point so that the rest of the processing pipeline will function
	# correctly:
	$s =~ s/ge/e/g;
	$s =~ s/gi/i/g;
	$s =~ s/jua/a/g;
	return $s;
}

###########################################################
#
# convertSingleConsonants(): Converts single consonants.
#
# NOTE: Use AFTER convertDigraphs()
#
###########################################################
sub convertSingleConsonants{
	my $s = $_[0];
	my $m = $_[1] // 0;
	$s =~ s/m//g;
	$s =~ s/n//g;
	$s =~ s/p//g;
	$s =~ s/t//g;
	$s =~ s/c//g;
	$s =~ s/k//g;
	$s =~ s/s//g;
	$s =~ s/z//g;
	$s =~ s/x//g;
	$s =~ s/h//g;
	$s =~ s/j//g;  # `j' converts to /h/ or saltillo in the modern orthography and in foreign loan words, names
	$s =~ s/l//g;
	$s =~ s/y//g;
	$s =~ s/w//g;
	$s =~ s/ñ//g;
	$s =~ s/v//g;
	$s =~ s/b//g;
	$s =~ s/d//g;
	$s =~ s/g//g;
	$s =~ s/f//g;
	$s =~ s/r//g;
	#
	# The following only applies in the modern orthography case:
	#
	if($m){
		$s =~ s/u//g; # `u' converts to /w/ phoneme in modern orthography
	}

	return $s;
}

############################################################
#
# convertVowels(): converts simple vowels to abugida atomics
#
############################################################
sub convertVowels{
	my $s = $_[0];
	$s =~ s/a//g;
	$s =~ s/e//g;
	$s =~ s/i//g;
	$s =~ s/o//g;
	$s =~ s/u//g;   # `u' only occurs in foreign words in the classical orthography
	# convert long vowels:
	$s =~ s/ā//g;
	$s =~ s/ē//g;
	$s =~ s/ī//g;
	$s =~ s/ō//g;
	$s =~ s/ū//g;
	return $s;
}

#
# asciifyVowels removes macrons and accents from the vowels
#
sub asciifyVowels{
	my $s = $_[0];
	$s =~ s/[āáàäâã]/a/g;
	$s =~ s/[éēèëê]/e/g;
	$s =~ s/[íīìïî]/i/g;
	$s =~ s/[ōóòöôõ]/o/g;
	$s =~ s/[ūúùüû]/u/g;
	return $s;
}

sub addNamePrefix{
	my $s = $_[0];
	$s =~ s/ ([A-Z][a-z]+) / \1 /g;
	return $s;
}

sub isConsonant{
	return $_[0] =~ /[]/;
}

sub isVowel{
	return $_[0] =~ /[]/;
}

sub isVowelSignA{
	return $_[0] eq "";
}

############################################################
#
# isVowelSign detects simple vowel signs /a/,/e/,/i/,/o/,/u/
#
############################################################
sub isVowelSign{
	return $_[0] =~ /[]/;
}

sub isLongVowelIndicator{
	return $_[0] eq "";
}

sub isNotAbugida{
	return not (isConsonant($_[0]) or isVowel($_[0]) or isLongVowelIndicator($_[0]));
}

############################################################
#
# vowelHash: Maps atomic vowels to corresponding vowel signs
#
############################################################
my $vowelHash = {
        "" => "",
        "" => "",
        "" => "",
        "" => "",
        "" => "",
};

###############################################################
#
# vowelSignPlusVowelHash: Maps an above-base vowel sign
#                         followed by an atomic vowel letter
#                         to one of the combined vowel signs.
#
# NOTE: Combined vowel signs in the abugida as of this writing
#       currently only exist for some of the 
#       common vowel combinations like /ia/, /oa/, etc.
#
###############################################################
my $vowelSignPlusVowelHash = {
	"" => "",
	"" => "",
	"" => "",
	"" => "",
	"" => "",
};

#####################################################
#
# makeSubjoined(): prefixes a consonant letter with 
#                  the subjoiner character
#
######################################################
sub makeSubjoined{
	return "" . $_[0];
}

######################################################################
#
# structure(): Takes a "raw" string of abugida letters and
#              structures it into syllabic clusters by
#              doing the following:
#
#              (1) If there is a vowel following a consonant,
#                  convert the vowel to the corresponding 
#                  above-base vowel sign.
#
#              (2) If there is a consonant after the vowel *AND*
#                  that consonant is followed by another consonant
#                  (i.e., CVC·C), then the consonant directly after
#                  the vowel is a syllable-terminal consonant so
#                  convert it to a subjoined form.
#
#              (3) If there is a consonant after the vowel *AND*
#                  that consonant is followed by a space or 
#                  punctuation or some other non-abugida symbol,
#                  (i.e., CVC·x), then this is also a syllable-terminal
#                  consonant so convert it to the subjoined form.
#
#              (4) If there is an above-base vowel sign followed by
#                  a remaining atomic vowel letter, see if the pair
#                  can be converted to a single above-base combined
#                  vowel sign. NOTA BENE: Only some combined signs
#                  exist.
#
#              (5) Finally, /a/ is intrinsic on base consonants
#                  so remove the above-base vowel sign /a/ as the
#                  final step.
#
######################################################################
sub structure{
	
	my $s = $_[0];
	#
	# SPLIT STRING ON UNICODE CODE POINT BOUNDARIES
	# (THIS WORKS ON THE PUA CHARACTERS THAT WE ARE USING)
	#
	my @elem = $s =~ /\X/g;
	my $lastPosition = $#elem;
	my $elemCount = 1+$lastPosition;
	
	my $res = "";
	
	my $first;
	my $second;
	my $third;
	my $fourth;
	
	for(my $i=0;$i<$elemCount;$i++){
		
		$first   = $elem[$i];
		
		if($i+1 <= $lastPosition){
			$second = $elem[$i+1];
		}else{
			$second = "";
		}
		
		if($i+2 <= $lastPosition){
			$third = $elem[$i+2];
		}else{
			$third = "";
		}
		
		if($i+3 <= $lastPosition){
			$fourth = $elem[$i+3];
		}else{
			$fourth = "";
		}
		#
		# DEBUG:
		# print ">>>Quartet at $i is $first$second$third$fourth\n";
		#
		
		if(isConsonant($first) and isVowel($second)){
			$elem[$i+1]= $vowelHash->{$second};
			if( isConsonant($third) and (isNotAbugida($fourth) or isConsonant($fourth)) ){
				$elem[$i+2] = makeSubjoined($third); 
			}
		}
		# remaining vowels with trailing consonants:
		if( (isVowel($first) or isLongVowelIndicator($first)) 
		    and isConsonant($second) 
		    and (isNotAbugida($third) or isConsonant($third)) 
		){
			$elem[$i+1] = makeSubjoined($second);
		}
	}
	
	#
	# Convert vowel sign + vowel to dipthong vowel signs:
	#
	for(my $i=0;$i<$elemCount;$i++){
		
		$first   = $elem[$i];
		
		if($i+1 <= $lastPosition){
			$second = $elem[$i+1];
		}else{
			$second = "";
		}
		
		if(isVowelSign($first) and isVowel($second)){
			my $dipthongSign = $vowelSignPlusVowelHash->{$first . $second};
			if($dipthongSign){
				$elem[$i]=$dipthongSign;
				$elem[$i+1]="";
			}
		}
	}
	# Remove above-base vowel sign /a/s as they are redundant
	# in non-educational, non-didactic contexts:
	for(my $i=0;$i<$elemCount;$i++){
		if(isVowelSignA($elem[$i])){
			$elem[$i]="";
		}
	}
	return join("",@elem);
}

#################################################################
#
# convert(): Combine all the steps to convert
#
#            $s: string to convert
#            $m: true to interpret as modern orthography
#                (default is false because most conversions 
#                are from classical orthography)
#            $l: true to preserve doubled (geminated) /l/
#                (default is false because we treat /l/ as
#                 geminated without having to double the symbol)
#
#################################################################
sub convert{
	my $s = $_[0];
	my $m = $_[1] // 0;                   # 2nd param to convert from modern (SEP) orthography: defaults to clasical (no).
	my $l = $_[2] // 0;                   # 3rd param to preserve double (geminated) /l/ in output: defaults to no.
	
	#$s = addNamePrefix($s);               # Prefix names with capitalized first letters with the name prefix symbol
	                                       # (We cannot distinguish people vs places, but this is still a useful start)
	                                       # THIS IS TOO SIMPLISTIC SO SKIP 
	
	$s = lc($s);                          # to lower case
	$s = asciifyVowels($s);               # don't do this step if you want to preserve long vowels with macrons
	                                      # otherwise, you probably want this
	
	$s = convertDigraphs($s,$l);          # convert all digraphs to abugida atomics
	$s = convertSingleConsonants($s,$m);  # convert all remaining consonants
	$s = convertVowels($s);               # convert all remaining vowels
	#print "1: $s \n";                    # At this point we have the "raw" conversion ...
	$s = structure($s);                   # structure syllabic clusters with vowel signs
	                                      # and subjoined consonants
	return $s;
}

###########################
#
# MAIN PROCESSING:
#
# Here is a typical usage scenario:
#
###########################
# my $string = decode('UTF-8',$ARGV[0]);
# $string = convert($string);
# print "$string\n";                           # print result


#
# Perl Module return value (true):
#
1;

