/**
 * @file Exports all commonly-used log-related objects.
 */
const verbosity = require('./verbosity.js');
const log = require('./log.js');
const colors = require('ansi-colors'); // Re-export for convenience.

module.exports = {
  log,
  verbosity,
  colors,
};
