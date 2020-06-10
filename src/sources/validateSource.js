const { log, colors } = require('../log');
const { validateRule } = require('pulley-core');
const extractRule = require('../rules/extractRule.js');

/**
 * Validates an array of rules `rules` against configuration `options`.
 *
 * @param {Array} rules - Array of Rule instances or arrays.
 * @param {Object} options - Options to validate.
 * @param {Object} callbacks - Callback functions for rule validation.
 * @param {function} callbacks.onStart - Called when rule evaluation begins.
 * @param {function} callbacks.onSuccess - Called when all rules are validated successfully.
 * @param {function} callbacks.onFailure - Called when all rules are validated but one or more has failed.
 * @param {function} callbacks.onRuleStart - Called when a rule begins evaulation.
 * @param {function} callbacks.onRuleSuccess - Called when a rule evaluation succeeds.
 * @param {function} callbacks.onRuleFailure - Called when a rule evaluation fails.
 */
const validateRules = async (rules, options, callbacks) => {
  const {
    onStart,
    onSuccess,
    onFailure,
    onRuleStart,
    onRuleSuccess,
    onRuleFailure
  } = (callbacks || {});

  /*
   * Create rule test promises.
   *
   * Some rules do not require any asynchronous operations; these rules are
   * executed and evaluated immediately.
   *
   * @param {Object} rule - Rule for which to create evaluation promise.
   *
   * @returns {Promise} Rule evaluation promise.
   */
  (typeof onStart === 'function' && onStart(rules));
  const rulePromises = rules.map(async (rule) => {
    (typeof onRuleStart === 'function' && onRuleStart(rule));
    const ruleInstance = extractRule(rule);
    let message;
    try {
      message = await validateRule(rule);
      (typeof onRuleSuccess === 'function' && onRuleSuccess(rule, message));
    }
    catch (err) {
      (typeof onRuleFailure === 'function' && onRuleFailure(rule, err.message));
      throw err;
    }
    return message;
  });

  /*
   * Evaluate rules.
   */
  try {
    await Promise.all(rulePromises);
    (typeof onSuccess === 'function' && onSuccess(rules));
  }
  catch (err) {
    (typeof onFailure === 'function' && onFailure(rules));
  }
}

/**
 * Callbacks that should be executed during Rule evaluation.
 *
 * These callbacks are used only for logging purposes.
 */
const callbacks = {
  /**
   * Called when all source rules begin validation.
   *
   * Outputs a log message to indicate that validation is starting.
   *
   * @param {Array} rules - Array of rules being validated.
   */
  onStart: (rules) => {
    // TODO Explore ability to add name of package that is being validated.
    log.send(`Validating ${rules.length} configuration rule(s)`);
  },

  /**
   * Called when all source rules have validated successfully.
   *
   * Outputs a log message to indicate that validation has succeeded.
   *
   * @param {Array} rules - Array of rules that have been validated.
   */
  onSuccess: (rules) => {
    log.sendSuccess(`Validated ${rules.length} configuration rule(s)`);
  },

  /**
   * Called when all source rules have validated with one or more failure.
   *
   * Outputs a log message to indicate that validation has failed.
   *
   * @param {Array} rules - Array of rules that have been validated.
   */
  onFailure: (rules) => {
    log.sendError(`Failed to validate one or more rules`);
  },

  /**
   * Called when an individual source rule has validated successfully.
   *
   * Outputs a log message to indicate that rule validation has succeeded.
   *
   * @param {Object} rule - Rule that has been validated.
   * @param {string} ruleMessage - Rule validation success message.
   */
  onRuleSuccess: (rule, ruleMessage) => {
    const ruleInstance = extractRule(rule);
    const ruleName = ruleInstance.name.toLowerCase();
    const message = `Passed ${colors.bold(ruleName)} rule. ${ruleMessage}`;

    log.sendInfo(message, { success: true });
  },

  /**
   * Called when an individual source rule has validated unsuccessfully.
   *
   * Outputs a log message to indicate that rule validation has failed.
   *
   * @param {Object} rule - Rule that has been validated.
   * @param {string} ruleError - Rule validation error message.
   */
  onRuleFailure: (rule, ruleError) => {
    const ruleInstance = extractRule(rule);
    const ruleName = ruleInstance.name.toLowerCase();

    log.sendError(`Failed ${colors.bold(ruleName)} rule. ${ruleError}`);
  },
};

/**
 * Validates that the Source `source` is configured correctly.
 *
 * Uses the rules defined by the source's `getOptionRules` method to
 * validate package configuration.
 *
 * @param {Object} source - Source whose configuration is being validated.
 * @param {Object} options - Options object to validate.
 */
const validateSource = async (source, options) => {
  await validateRules(source.getOptionRules(), options, callbacks);
};

/**
 * Validates that the AuthenticatedSource `source` is configured correctly.
 *
 * Uses the rules defined by the source's `getOptionRules` and
 * `getAuthenticationRules` methods to validate package configuration.
 *
 * @param {Object} source - Source whose configuration is being validated.
 * @param {Object} options - Options object to validate.
 * @param {Object} authentication - Authentication options object to validate.
 */
const validateAuthenticatedSource = async (source, options, authentication) => {
  const promises = [
    validateRules(source.getOptionRules(), options, callbacks),
    validateRules(source.getAuthenticationRules(), authentication, callbacks),
  ];

  await Promise.all(promises);
};

module.exports = {
  validateSource,
  validateAuthenticatedSource,
};
