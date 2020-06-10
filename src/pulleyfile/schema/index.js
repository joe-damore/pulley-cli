/**
 * @file Pullyfile schema re-exports.
 */
const v1 = require('./v1.js');
const validatePulleyfile = require('./validate.js');

module.exports = {
  v1,
  validatePulleyfile,
};
