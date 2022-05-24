const fs = require('fs');
const path = require('path');

const textFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textFile, 'utf-8');
readStream.on('data', (readable) => {
  console.log(readable);
});