/**
 * Map structure assigning human-readable error codes to numeric counterparts.
 *
 * In some cases, these error codes may be used as the application exit code
 * if the error causes Pulley to exit.
 */
const errorCodes = {

  /**
   * Pulleyfile does not exist or failed to load.
   */
  ERR_NO_PULLEYFILE: 1,

  /**
   * Returns the error code number for the given human readable error code.
   *
   * If no error code number exists for `errorCodeString`, null is returned.
   *
   * @param {string} errorCodeString - Human readable error code string.
   *
   * @returns {number|null} Error code number.
   */
  fromString: (errorCodeString) => {
    if (errorCodes[errorCodeString]) {
      return errorCodes[errorCodeString];
    }
    return null;
  },

  /**
   * Returns the human readable error code for the given error code number.
   *
   * If no error code string exists for `errorCodeNumber`, null is returned.
   *
   * @param {number} errorCodeNumber - Error code number.
   *
   * @returns {string|null} Human readable error code string.
   */
  fromNumber: (errorCodeNumber) => {
    const key = Object.keys(errorCodes)
      // Only check actual error codes -- methods on this object should be excluded.
      .filter((key) => {
        return (typeof errorCodes[key] === 'string' || typeof errorCodes[key] === 'number');
      })
      .find((key) => {
        return (errorCodes[key] == errorCodeNumber);
      });

    if (key) {
      return key;
    }
    return null;
  },
};

module.exports = errorCodes;
