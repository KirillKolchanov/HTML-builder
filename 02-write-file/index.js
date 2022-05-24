const fs = require('fs');
const { dirname } = require('path');
const path = require('path');

const { stdin, stdout, exit } = process;

function closeConsole() {
  stdout.write('\nДосвидания!');
  exit();
}
process.on('SIGINT', closeConsole);

const createFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Введите текст:\n');
stdin.on('data', message => {
  if (message.toString() === 'exit\n') {
    closeConsole();
  } else {
    createFile.write(message);
  }
});


