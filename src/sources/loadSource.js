/**
 * @file Function to retrieve source class objects.
 */

const LocalSource = require('pulley-source-local');
const { log, colors } = require('../log');

/**
 * Map structure of default sources.
 *
 * Each key represents the source name that would be specified in the
 * Pulleyfile, and the value contains a Source class that is used.
 */
const defaultSources = {
  local: LocalSource,
};

/**
 * Loads the source with the given name.
 *
 * At this time, 'loadSource' may be a slight misnomer; no blocking operation
 * is used to retrieve sources. In the future, this function is intended to
 * retrieve built-in sources as well as custom functions on-the-fly from
 * places like GitHub and NPM.
 *
 * @param {string} sourceName - Case-sensitive name of source being retrieved.
 *
 * @returns {function} Constructor of source for `sourceName`.
 */
const loadSource = (sourceName) => {
  log.sendInfo(`Retrieving ${colors.bold(sourceName)} source`);
  if (defaultSources[sourceName]) {
    log.sendInfo(`Retrieved source ${colors.bold(sourceName)} from built-in sources`, {
      success: true,
    });
    return defaultSources[sourceName];
  }
  // TODO Explore adding custom plugin loading from NPM and/or GitHub.
  // TODO Use identifiable error.
  log.sendError(`Source ${colors.bold(sourceName)} does not exist`);
  throw new Error(`Source named '${sourceName}' does not exist`);
};

module.exports = loadSource;
