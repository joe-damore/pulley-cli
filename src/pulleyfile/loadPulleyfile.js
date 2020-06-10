/**
 * @file Pulleyfile load functions.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const { log, colors } = require('../log');

/**
 * Pulleyfile names to check for when no filepath is provided.
 *
 * Names are listed in order of priority.
 */
const defaultNames = [
  'pulleyfile.yaml',
  'pulleyfile.yml',
  'pulleyfile',
];

/**
 * Finds a Pulleyfile in the current working directory.
 *
 * Checks the filenames of all files in the current directory, and returns the
 * first one that's found which matches a name in `defaultNames`.
 *
 * @return {string} Pulleyfile filename.
 */
const findPulleyfile = async () => {
  const files = await fs.promises.readdir('.');
  const file = files.find((file) => {
    return (defaultNames.includes(file.toLowerCase()));
  });

  if (!file) {
    // TODO Throw identifiable error.
    throw Error('No Pulleyfile found');
  }

  return file;
};

/**
 * Loads the pulleyfile at the optional `filepath` and returns its data.
 *
 * When `filepath` is not specified, common filenames within the current
 * working directory are checked and, if found, loaded instead.
 *
 * @param {string=} filepath - Pulleyfile filepath.
 *
 * @return {Object} Pulleyfile data.
 */
// TODO Refactor loadPulleyfile().
const loadPulleyfile = async (filepath) => {
  let pulleyfilePath = filepath;
  if (!pulleyfilePath) {
    log.sendWarning('No Pulleyfile specified; attempting to find one instead');
    try {
      pulleyfilePath = await findPulleyfile();
    }
    catch (err) {
      log.sendError('Unable to find Pulleyfile');
      log.sendDebug(`Expected one of: ${defaultNames.map(name => colors.bold(name)).join(', ')}`);
      throw new Error('Cannot find Pulleyfile');
    }
  }
  pulleyfilePath = path.resolve(pulleyfilePath);
  log.sendInfo(`Loading Pulleyfile at ${colors.bold(pulleyfilePath)}`);

  let pulleyFileData;
  try {
    pulleyfileData = await fs.promises.readFile(pulleyfilePath, {
      encoding: 'utf8',
    });
    pulleyfileObject = yaml.parse(pulleyfileData);
  }
  catch (err) {
    // TODO Throw identifiable error.
    log.sendError(`Failed to load Pulleyfile at ${colors.bold(pulleyfilePath)}`);
    throw new Error('Pulleyfile load error');
  }

  log.sendInfo(`Loaded Pulleyfile ${colors.bold(pulleyfilePath)}`, {
    success: true,
  });

  return pulleyfileObject;
};

module.exports = loadPulleyfile;
