const { log, colors } = require('../log');
const { validateRule } = require('pulley-core');
const extractRule = require('../rules/extractRule.js');

// TODO Examine replacement for `packageData` params to avoid passing Pulleyfile data across app.

/**
 * Validates that the AuthenticatedSource `source` is configured correctly.
 *
 * Uses the rules defined by the source's `getAuthenticationRules` method to
 * validate package configuration.
 *
 * @param {Object} source - Source whose configuration is being checked.
 * @param {Object} packageData - Pulleyfile package data.
 */
const validateAuthenticatedSource = async (source, packageData) => {
  await validateSource(source, packageData);
  // TODO Add validation for authentication options.
};

/**
 * Validates that the Source `source` is configured correctly.
 *
 * Uses the rules defined by the source's `getOptionRules` method to
 * validate package configuration.
 *
 * @param {Object} source - Source whose configuration is being checked.
 * @param {Object} packageData - Pulleyfile package data.
 */
const validateSource = async (source, packageData) => {
  const rules = source.getOptionRules();
  const name = packageData.name;
  log.send(`Validating ${rules.length} configuration rule(s) for ${colors.bold(name)}`);

  /**
   * Create an array of Rule test promises.
   *
   * Rule tests that are not async will be evaluated immediately.
   *
   * @param {Object} rule - Rule to evaluate.
   */
  const promises = rules.map(async (rule) => {
    const ruleInstance = extractRule(rule);
    const ruleName = ruleInstance.name.toLowerCase();

    try {
      const success = await validateRule(rule);
      const successString = `Passed ${colors.bold(ruleName)} rule. ${success}`;
      log.sendInfo(successString, { success: true });

      return success;
    }
    catch (err) {
      // TODO Only display rule validation errors.
      const errorString = `Failed ${colors.bold(ruleName)} rule. ${err.message}`;
      log.sendError(errorString);
      throw err;
    }
  });

  // Evaluate rules.
  try {
    // Wait for rule tests and display success message.
    await Promise.all(promises);
    log.sendSuccess(`Validated configuration rules for ${colors.bold(name)}`);
  }
  catch (err) {
    // Display error message if one or more tests fail.
    log.sendError(`Failed to validate one or more rules for ${colors.bold(name)}`);
  }
};

module.exports = validateSource;
