const fs       = require('fs');
const readline = require('readline');

if(process.argv.length != 3){
  console.log('Please specify file to read.');
  process.exit(1);
}

const inputFile = process.argv[2];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(inputFile)
});

/////////////////////////////////////
//
// lineReader ON LINE PROCESSOR:
//
/////////////////////////////////////
let count=1;
lineReader.on('line', function (line) {
 
  // Replace all "j"s nestled between consonants with "i"s:
  line = line.replace(/([lmnprstxz])j([clmnprstxz])/g,function(m,p1,p2){
    return `${p1}i${p2}`;
  })
  line = line.replace(/([LMNPRSTXZ])J([CLMNPRSTXZ])/g,function(m,p1,p2){
    return `${p1}I${p2}`;
  })
  // Replace all "j"s preceded by a vowel and followed by a consonant with "h":
  line = line.replace(/([aeio])j([clmnprstxz])/g,function(m,p1,p2){
    return `${p1}h${p2}`;
  })
  line = line.replace(/([AEIO])J([CLMNPRSTXZ])/g,function(m,p1,p2){
    return `${p1}H${p2}`;
  })
  // Replace remaining "j"s with "i"s: These will be things like "qujn" or "jconeuh" etc:
  line = line.replace(/j/g,'i');
  line = line.replace(/J/g,'I');
  
  // Replace all "b"s with "p"s. Nahuatl does not have "b" ...
  line = line.replace(/b/g,'p');
  line = line.replace(/B/g,'P');
  
  // Replace "n" before "p" with "mp": Thus, "canpa"=>"campa" etc.:
  line = line.replace(/np/g,'mp');
  line = line.replace(/NP/g,'MP');
  
  // Replace all "v"s followed by CONSONANTS with "o"s:
  line = line.replace(/v([clmnpstxz])/g,function(m,p1){
    return `o${p1}`;
  });
  line = line.replace(/V([CLMNPSTXZ])/g,function(m,p1){
    return `O${p1}`;
  });
  
  // Replace all "v"s followed by VOWELS with "hu"s:
  line = line.replace(/v([aei])/g,function(m,p1){
    return `hu${p1}`;
  });
  line = line.replace(/V([AEI])/g,function(m,p1){
    return `Hu${p1}`;
  });
  
  // Replace "u" nested between VOWELS with "hu":
  line = line.replace(/([aeio])u([aeio])/g,function(m,p1,p2){
    return `${p1}hu${p2}`;
  })
  line = line.replace(/([AEIO])U([AEIO])/g,function(m,p1,p2){
    return `${p1}HU${p2}`;
  })
  // Replace all "o"s nested between VOWELS with "hu":
  line = line.replace(/([aei])o([aei])/g,function(m,p1,p2){
    return `${p1}hu${p2}`;
  })
  line = line.replace(/([AEI])O([AEI])/g,function(m,p1,p2){
    return `${p1}HU${p2}`;
  })
  
  // Replace "u" nested between NAHUATL CONSONANTS with "o":
  line = line.replace(/([clmnprstxz])u([clmnprstxz])/g,function(m,p1,p2){
    return `${p1}o${p2}`;
  })
  line = line.replace(/([CLMNPRSTXZ])U([CLMNPRSTXZ])/g,function(m,p1,p2){
    return `${p1}O${p2}`;
  })
  
  // Replace "i" nested between vowels with "y":
  line = line.replace(/([aeio])i([aeio])/g,function(m,p1,p2){
    return `${p1}y${p2}`;
  })
  line = line.replace(/([AEIO])I([AEIO])/g,function(m,p1,p2){
    return `${p1}Y${p2}`;
  })
  
  // Replace word-initial "y" with "i" when followed by a consonant:
  line = line.replace(/\by([chlmnpstxz])/g,function(m,p1){
    return `i${p1}`;
  })
  line = line.replace(/\bY([CHLMNPSTXZ])/g,function(m,p1){
    return `I${p1}`;
  })

  // Replace word-initial "i" with "y" when followed by a vowel:
  line = line.replace(/\bi([aeio])/g,function(m,p1){
    return `y${p1}`;
  })
  line = line.replace(/\bI([AEIO])/g,function(m,p1){
    return `Y${p1}`;
  })
  
  // Replace "hoa" with "hua":
  line = line.replace(/hoa/g,'hua');
  line = line.replace(/HOA/g,'HUA');
  // print out line:
  console.log(line);
  
  count++;
});
