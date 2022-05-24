const fs = require('fs');
const path = require('path');

const createDir = path.join(__dirname, 'files-copy');
const oldDir = path.join(__dirname, 'files');

fs.readdir(createDir, (err, data) => {
  if (err) throw err;
  for (let i = 0; i < data.length; i++) {
    fs.promises.unlink(createDir + '/' + data[i]);
  }
})

fs.readdir(oldDir, (err, data) => {
  if (err) throw err;
  for (let i = 0; i < data.length; i++) {
    fs.copyFile(oldDir + '/' + data[i], createDir + '/' + data[i], err => {if (err) throw err});
  }
})

fs.promises.mkdir(createDir, {recursive: true});