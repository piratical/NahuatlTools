

if(process.argv.length != 5){
  console.log('USAGE IS:');
  console.log(`node ${process.argv[1]} <key_name> <key_value> <json_data_file>`);
  process.exit(1);
}

const key = process.argv[2];
const val = process.argv[3];
const fn  = process.argv[4];

const data = require(`./${fn}`);

data.forEach(entry=>{
  entry[key] = val;
});

const output = JSON.stringify(data,null,2);
  console.log(output);


