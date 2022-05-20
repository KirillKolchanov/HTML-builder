const fs = require('fs');

const readStream = fs.createReadStream('./01-read-file/text.txt', 'utf-8');
readStream.on('data', (readable) => {
  console.log(readable);
});