const fs = require('fs/promises');

async function main() {
  const fileOrDirList = await fs.readdir('./03-files-in-folder/secret-folder');
  const fileOrDirStats = await Promise.all(
    fileOrDirList.map(async (fileOrDirName) => ({
      name: fileOrDirName,
      stats: await fs.stat(`./03-files-in-folder/secret-folder/${fileOrDirName}`)
    }))
  );

  fileOrDirStats
    .filter((findFileOrDirData) => findFileOrDirData.stats.isFile())
    .forEach(file => {
      const [fileName, fileExtension] = file.name.split('.');
      const fileSize = Math.ceil(file.stats.size / 1024);

      console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
    });
}

main();