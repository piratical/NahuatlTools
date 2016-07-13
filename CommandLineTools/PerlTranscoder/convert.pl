#!/opt/local/bin/perl

use strict;
use utf8;
use Encode;
binmode(STDIN,  ':utf8');
binmode(STDOUT, ':utf8');
binmode(STDERR, ':utf8');

use Nahuatl::Transcode ('convert');

my $filename = $ARGV[0];
my $convertedRow;

open(my $fh, '<:encoding(UTF-8)', $filename)
 or die "Could not open file '$filename' $!";

while (my $row = <$fh>) {
    $convertedRow = convert($row);
    print "$convertedRow";
} 

