const fs = require('fs');

const files = fs.readdirSync('./03-files-in-folder/secret-folder');

files
  .map((fileOrDirName) => ({
    name: fileOrDirName,
    stats: fs.statSync(`./03-files-in-folder/secret-folder/${fileOrDirName}`)
  }))
  .filter(findFileOrDirData => findFileOrDirData.stats.isFile())
  .forEach(file => {
    const [fileName, fileExtension] = file.name.split('.');
    const fileSize = Math.ceil(file.stats.size / 1024);

    console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
  });