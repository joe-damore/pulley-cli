const boxen = require('boxen');
const { log, colors } = require('../log');

/**
 * Send a message without any formatting.
 *
 * @param {string} message - Message to send.
 */
const sendRaw = (message) => {
  log.send(message, {
    formatting: {
      raw: true,
    }
  });
};

/**
 * Returns an array of strings from the given key/value pairs `keyValues`.
 *
 * `keyValues` should be an array of objects, each with a `key` and `value`
 * property.
 *
 * @param {Array} keyValues - Array of key/value objects.
 *
 * @returns {Array} Array of key/value strings.
 */
const keyValuePairsToLines = (keyValues) => {
  // Get max key length for formatting purposes.
  const maxKeyLength = (() => {
    let currentMax = 0;
    keyValues.forEach((keyValue) => {
      if (keyValue.key.length > currentMax) {
        currentMax = keyValue.key.length;
      }
    });
    return currentMax;
  })();

  /**
   * Maps each key/value pair object to a string.
   *
   * @param {object} keyValue - Key/value pair object.
   *
   * @returns {string} Key/value pair string.
   */
  const keyValueLines = keyValues.map((keyValue) => {
    const key = keyValue.key;
    const value = keyValue.value;

    const paddingChar = ' ';
    const paddingLength = maxKeyLength - key.length;
    const paddingString = paddingChar.repeat(paddingLength);

    return `${paddingString}${colors.bold(key)} : ${value}`;
  });

  return keyValueLines;
};

/**
 * Returns an array of key/value pairs from the given metadata object.
 *
 * If no `allowedKeys` parameter is specified, all keys on the object are
 * converted to key/value pairs. Otherwise, only the keys specified in
 * `allowedKeys` are included.
 *
 * @param {Object} metadata - Metadata object to convert to key/value pairs.
 * @param {Array=} allowedKeys - Strings describing keys that can be included.
 *
 * @returns {Array} Array of key/value objects from the given object.
 */
const keyValuePairsFromMetadata = (metadata, allowedKeys) => {
  const mapFunction = (key) => {
    return { key: key, value: metadata[key] };
  };

  const filterFunction = (key) => {
    if (allowedKeys) {
      return allowedKeys.includes(key);
    }
    return true;
  };

  return Object.keys(metadata)
    .filter(filterFunction)
    .map(mapFunction);
};

/**
 * Logs information about the given package.
 *
 * @param {Object} packageInstance - Package to display.
 */
const displayPackageInfo = (packageInstance) => {

  /*
   * Array of metadata keys that, if specified, are listed under package info.
   */
  const allowedMetadata = (() => {
    if (log.verbosity === log.verbosityLevels.DEBUG) {
      // Don't whitelist metadata if DEBUG verbosity.
      return undefined;
    }
    return [
      'author',
      'description',
      'version',
      'note',
    ];
  })();

  // Always include package source with metadata display.
  let metadata = [{
    key: 'source',
    value: packageInstance.source,
  }];

  // If package metadata is specified, combine it with `metadata`.
  if (packageInstance.metadata) {
    metadata = [
      ...keyValuePairsFromMetadata(packageInstance.metadata, allowedMetadata),
      ...metadata,
    ];
  }

  const lines = [
    `${colors.bold(packageInstance.name)}`,
    '',
    ...keyValuePairsToLines(metadata),
  ];

  sendRaw(boxen(lines.join('\n'), {
    borderStyle: 'doubleSingle',
    borderColor: 'cyan',
    margin: 1,
    padding: 1,
  }));
};

module.exports = displayPackageInfo;
