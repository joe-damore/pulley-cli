/**
 * @file Defines and parses command line parameters.
 */

const { Command } = require('commander');
const pulleyInfo = require('../package.json');

/**
 * Increases verbosity for each '--verbose' flag passed.
 *
 * @param {any} dummy - Unused parameter.
 * @param {number} previous - Previous value.
 *
 * @returns {number} Previous value, plus one.
 */
const incrementVerbosity = (dummy, previous)  => {
  return (previous + 1);
}

const program = new Command();

// TODO Add 'silent' or similar option to silence output
// TODO Add 'hide <element>' or similar option to hide specific log output
// TODO Add 'skip-missing-packages' or similar option to not bail on package retrieval failure
// TODO Add 'yes' or similar option to automatically proceed through all (most?) prompts

program
  .name(pulleyInfo.name)
  .version(pulleyInfo.version)
  .option('-p, --pulleyfile <path>', 'path to Pulleyfile')
  .option('-d, --dest', 'path to output bundle destination')
  .option('-b, --bundler', 'output bundler to use')
  .option('-v, --verbose', 'verbose output', incrementVerbosity, 1);

program.parse(process.argv);

// If 'verbose' flag is not specified, default to 1 (NORMAL verbosity level).
program.verbose = (program.verbose || 1);

module.exports = program;
