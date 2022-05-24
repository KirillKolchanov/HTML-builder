
const fs = require('fs/promises');
const path = require('path');

const newDir = path.join(__dirname, 'copy-files');
const oldDir = path.join(__dirname, 'files');

async function main() {
  try {
    await fs.mkdir(newDir, {recursive: true});

    const copiedFiles = await fs.readdir(newDir);
    for (const copiedFile of copiedFiles) {
      await fs.unlink(`${newDir}/${copiedFile}`);
    }

    const files = await fs.readdir(oldDir);
    for (const file of files) {
      await fs.copyFile(`${oldDir}/${file}`, `${newDir}/${file}`);
    }
  } catch (err) {
    console.log(err);
  }
}

main();