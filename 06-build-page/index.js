const fs = require('fs');
const path = require('path');

const createDistDir = path.join(__dirname, 'project-dist');
const createStylesDir = path.join(__dirname, 'project-dist', 'style.css');
const copyDirAssets = path.join(__dirname, 'assets');
const createAssetsDir = path.join(__dirname, 'project-dist', 'assets');
const copyStyles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');
const HTMLPath = fs.createReadStream('./06-build-page/template.html');

let writeStyleStream = fs.createWriteStream(createStylesDir);

fs.promises.mkdir(createDistDir, {recursive: true});

fs.readdir(copyStyles, (err, files) => {
  files.forEach(file => {
    if (path.extname(file, err) == '.css') {
      if (err) {
        console.log(err);
      } else {
        const newStylesPath = path.join(__dirname, 'styles', file);
        const stream = fs.createReadStream(newStylesPath);
        stream.on('data', (data , err) => {
          if (err) {
            console.log(err);
          }
          writeStyleStream.write(data);
        });
      }
    }
  });
});

async function copyDir(copyDirAssets, createAssetsDir) {
  await fs.promises.mkdir(createAssetsDir, {
    recursive: true
  });

  const files = await fs.promises.readdir(copyDirAssets, {
    withFileTypes: true
  });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const oldFile = path.join(copyDirAssets, file.name);
      const newFile = path.join(createAssetsDir, file.name);
      await fs.promises.copyFile(oldFile, newFile);
    } else {
      copyDir(path.join(copyDirAssets, file.name), path.join(createAssetsDir, file.name));
    }
  });
}

copyDir(copyDirAssets, createAssetsDir);

async function createHtmlPage() {
  const createHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  HTMLPath.on('data', (chunk) => {
    let templateString = chunk.toString();

    fs.readdir(components, {
      withFileTypes: true
    }, (err, files) => {
      if (err) throw err;
      files.forEach((file, i) => {
        if (file.isFile() && path.parse(file.name).ext === '.html') {
          const readComponents = fs.createReadStream(path.join(__dirname, 'components', file.name));
          const nameComponents = path.parse(file.name).name;
          const componentsObjectName = `{{${nameComponents}}}`;
          readComponents.on('data', (chunk) => {
            templateString = templateString.replace(componentsObjectName, chunk.toString());
            if (i === files.length - 1) {
              createHTML.write(templateString);
            }
          });
        }
      });
    });
  });
}

createHtmlPage(console.log('Folder Project dist was created'));