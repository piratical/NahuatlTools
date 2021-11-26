**glosario_parser.js**

This parser (c) 2020, 2021 by Edward H. Trager ALL RIGHTS RESERVED

This parser is designed to parse the IDIEZ 
glossary document called "Vocabulario náhuatl-español-inglés"
from 2012.10.30. 

I don't know if there were later versions of this or not, but
that version of the PDF actually had a ton of typographical errors and other 
omissions and inconsistencies.

For this reason, a lot of additional manual cleanup 
was needed to get the text version of that document to a consistent state where it 
could be parsed by this script. The cleaned-up text document, **g2.nfc.txt**, is 
therefore also included here. The abbreviation "*nfc*" refers to the fact that the
document has also been converted to Unicode UTF-8 using Normalization Form C for the
accented Latin vowel letters. In the original document, at least some of the accented
vowels were in Unicode NFD, which made additional processing more complicated. Now
everything is in NFC.



