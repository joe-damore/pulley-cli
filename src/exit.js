const log = require('./log/log.js');
const errorCodes = require('./errorCodes.js');

/**
 * Logs a message and exits the Node application.
 *
 * @param {number=} code - Exit code.
 * @param {string=} message - Exit log message.
 */
const exit = (code = 0, message = undefined) => {

  /**
   * Determines which log function to use.
   *
   * If error code is 0, log.sendNotice is used, otherwise log.sendError
   * is used.
   *
   * @returns {function} Log function.
   */
  const logFunction = (() => {
    if (code > 0) {
      return log.sendError;
    }
    return log.sendNotice;
  })();

  /**
   * Determines what the log message should be.
   *
   * If `message` is defined, it is always used. Otherwise, a default
   * message is used which differs depending on whether or not the exit code
   * is 0.
   *
   * @returns {string} Exit code log message.
   */
  const logMessage = (() => {
    if (message) {
      return message;
    }
    if (code > 0) {
      let codeReadable = errorCodes.fromNumber(code);
      let printedCode = !codeReadable ? code : `${code} (${codeReadable})`;
      return `Quitting Pulley with exit code ${printedCode}`;
    }
    return `Quitting Pulley. Goodbye!`;
  })();

  (logFunction.bind(log))(logMessage);
  process.exit(code);
}

module.exports = exit;
