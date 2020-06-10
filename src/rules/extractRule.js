/**
 * @file Utility function to retrieve a Rule instance from an array.
 */

/**
 * Retreives Rule instance from `rule`.
 *
 * Rules are often expressed either as simple Rule instances, or as indexed
 * arrays containing a Rule instance as its first item, with test-specific data
 * stored after.
 *
 * If `rule` is a Rule instance, it is returned. If it's an array containing
 * a Rule, that instance is returned instead.
 *
 * @param {Array|Object} rule - Rule instance, or array with Rule instance.
 *
 * @returns {Object} Rule instance.
 */
const extractRule = (rule) => {
  // TODO Use implementation from 'pulley-core' instead.
  if (Array.isArray(rule)) {
    return rule[0];
  }
  return rule;
};

module.exports = extractRule;
