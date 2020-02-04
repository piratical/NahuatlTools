
const a = ['xi','ni','ti','in'];
const b = ['neς','miτ','k','teς','meς','mo','ki','kin'];
const c = ['a','e','i','o'];

a.forEach( aa =>{
  b.forEach( bb => {
    c.forEach( cc => {
      console.log(`'${}${}${}:${}${}${}`);
    });
  });
});

function preserveVerbStem(s){
  const zwj = 0x200B;
  const replacement = `$1$2${zwj}$3`;
  return s.replace(/(xi|ni|ti|in)(neς|miτ|k|teς|meς|mo|ki|kin)(a|e|i|o)/g,replacement);
}


