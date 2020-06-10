/**
 * @file Function to retrieve Bundle class objects.
 */

// TODO Consider refactoring JS module-loading into an extendable interface.
// See also: ../sources/loadSource.js.

const DefaultBundler = require('pulley-bundler-default');
const { log, colors } = require('../log');

/**
 * Map structure of default bundlers.
 *
 * Each key represents the bundler name that would be specified in the
 * Pulleyfile, and the value contains a Bundler class that is used.
 */
const defaultBundlers = {
  default: DefaultBundler,
};

/**
 * Loads the source with the given name.
 *
 * At this time, 'loadBundler' may be a slight misnomer; no blocking operation
 * is used to retrieve bundlers. In the future, this function is intended to
 * retrieve built-in bundlers as well as custom bundlers on-the-fly from
 * places like GitHub and NPM.
 *
 * @param {string} bundlerName - Case-sensitive name of bundler being retrieved.
 *
 * @returns {function} Constructor of bundler for `bundlerName`.
 */
const loadBundler = (bundlerName) => {
  log.sendInfo(`Retrieving ${colors.bold(bundlerName)} bundler`);
  if (defaultBundlers[bundlerName]) {
    log.sendInfo(`Retrieved ${colors.bold(bundlerName)} bundler from built-in bundlers`, {
      success: true,
    });
    return defaultBundlers[bundlerName];
  }
  // TODO Explore adding custom plugin loading from NPM and/or GitHub.
  // TODO Use identifiable error.
  log.sendError(`Bundler ${colors.bold(bundlerName)} does not exist`);
  throw new Error(`Bundler named '${bundlerName}' does not exist`);
};

module.exports = loadBundler;
