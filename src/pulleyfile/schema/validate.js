/**
 * @file JSONSchema validation function for Pulleyfile data.
 */

const { Validator } = require('jsonschema');
const schema = require('./v1.js');
const { log } = require('../../log');

/**
 * Validates the given Pulleyfile data against the v1 Pulleyfile schema.
 *
 * Outputs log messages related to validation status and results.
 *
 * @param {Object} pulleyfileData - Data to validate.
 *
 * @returns {Object} JSONSchema validation results.
 */
const validate = (pulleyfileData) => {
  log.sendInfo(`Validating Pulleyfile against v1 schema`);
  const validator = new Validator();
  const results =  validator.validate(pulleyfileData, schema);

  if (results.errors && results.errors.length > 0) {
    const errorCount = results.errors.length;
    log.sendError(`Encountered ${errorCount} Pulleyfile validation errors:`);
    results.errors.forEach((error, index) => {
      log.sendError(`Error ${index + 1}/${errorCount}: ${error.stack}`);
    });
  }
  else {
    log.sendInfo(`Validated Pulleyfile`, {
      success: true,
    });
  }

  return results;
};

module.exports = validate;
