const fs = require('fs');
const path = require('path');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const styles = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(bundle);

fs.readdir(styles, (err, data) => {
  if (err) {
    throw err;
  }
  data.forEach(elem => {
    if (path.extname(elem, err) === '.css') {
      if (err) {
        throw err;
      } else {
        const updatedBundle = path.join(__dirname, 'styles', elem);
        const readStream = fs.createReadStream(updatedBundle);
        readStream.on('data', (data, err) => {
          if (err) {
            throw err;
          }
          writeStream.write(data);
        })
      }
    }
  })
})