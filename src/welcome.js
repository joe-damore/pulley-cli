const pulleyInfo = require('../package.json');
const colors = require('ansi-colors');
const figlet = require('figlet');

const welcome = () => {
  console.log(colors.yellow.bold(' Welcome to'));
  console.log(colors.yellow.bold(figlet.textSync('Pulley', 'Big')));
  console.log(colors.yellow.bold(` v${pulleyInfo.version}`));
  console.log(colors.yellow.bold(' ----------------------------'));
  console.log();
};

module.exports = welcome;
