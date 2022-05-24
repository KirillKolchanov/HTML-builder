const fs = require('fs');
const path = require('path');

const createDistDir = path.join(__dirname, 'project-dist');
const createStylesFile = path.join(__dirname, 'project-dist', 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const createDistPathAssets = path.join(__dirname, 'project-dist', 'assets');
const copyStylesPath = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');
const templateHTML = path.join(__dirname, 'template.html');
const HTMLPath = fs.createReadStream(templateHTML, 'utf-8');

fs.promises.mkdir(createDistDir, {recursive: true});

async function clearDir() {
  try {
    await fs.promises.rm(createDistDir, {recursive: true, force: true});
  } catch (err) {
    console.log(err);
  }
}

async function copeStyle() {
  let writeStyleStream = fs.createWriteStream(createStylesFile);

  fs.readdir(copyStylesPath, (err, data) => {
    data.forEach(file => {
      if (path.extname(file, err) == '.css') {
        if (err) {
          console.log(err);
        } else {
          const newStylesPath = path.join(__dirname, 'styles', file);
          const stream = fs.createReadStream(newStylesPath);
          stream.on('data', (chunk , err) => {
            if (err) {
              console.log(err);
            }
            writeStyleStream.write(chunk);
          });
        }
      }
    });
  });
}

async function copyDir(assetsDir, createDistPathAssets) {
  await fs.promises.mkdir(createDistPathAssets, {
    recursive: true
  });

  const files = await fs.promises.readdir(assetsDir, {
    withFileTypes: true
  });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const oldFile = path.join(assetsDir, file.name);
      const newFile = path.join(createDistPathAssets, file.name);
      await fs.promises.copyFile(oldFile, newFile);
    } else {
      copyDir(path.join(assetsDir, file.name), path.join(createDistPathAssets, file.name));
    }
  });
}

async function createHtmlPage() {
  const createHTMLBundel = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  HTMLPath.on('data', (chunk) => {
    let templateString = chunk.toString();

    fs.readdir(components, {
      withFileTypes: true
    }, (err, data) => {
      if (err) throw err;
      data.forEach((file, i) => {
        if (file.isFile() && path.parse(file.name).ext === '.html') {
          const readComponents = fs.createReadStream(path.join(__dirname, 'components', file.name));
          const nameComponents = path.parse(file.name).name;
          const componentsObjecName = `{{${nameComponents}}}`;
          readComponents.on('data', (chunk) => {
            templateString = templateString.replace(componentsObjecName, chunk.toString());
            if (i === data.length - 1) {
              createHTMLBundel.write(templateString);
            }
          });
        }
      });
    });
  });
}

(async () => {
  await clearDir();
  await copyDir(assetsDir, createDistPathAssets);
  await copeStyle();
  await createHtmlPage();
})();