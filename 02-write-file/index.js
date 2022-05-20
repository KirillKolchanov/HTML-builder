const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
function closeConsole() {
  stdout.write('\nДосвидания!');
  exit();
}
process.on('SIGINT', closeConsole);

const createFile = fs.createWriteStream(path.join('02-write-file', 'text.txt'));
stdout.write('Введите текст:\n');
stdin.on('data', message => {
  if (message.toString() === 'exit\n') {
    closeConsole();
  } else {
    createFile.write(message);
  }
  createFile.close();
});


