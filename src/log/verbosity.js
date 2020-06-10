/**
 * @file Map structure of log verbosity levels.
 */

/**
 * Map of log verbosity levels.
 */
const verbosityLevels = {
  SILENT: 0,
  NORMAL: 1,
  INFO: 2,
  DEBUG: 3,
  /**
   * Returns the most appropriate valid verbosity level for `verbosityLevel`.
   *
   * If `verbosityLevel` is null or undefined, `defaultVerbosityLevel` is used
   * instead.
   *
   * @param {number} verbosityLevel - Verbosity level to attempt to get.
   * @param {number=} defaultVerbosityLevel - Default verbosity level.
   *
   * @returns {number} Closest valid verbosity level to `verbosityLevel`.
   */
  get: (verbosityLevel, defaultVerbosityLevel = 1) => {
    // Short-circuit if verbosityLevel is undefined or null.
    if (verbosityLevel === undefined || verbosityLevel === null) {
      return verbosityLevels[defaultVerbosityLevel];
    }

    const MIN_VERBOSITY = verbosityLevels.SILENT;
    const MAX_VERBOSITY = verbosityLevels.DEBUG;

    /**
     * Limits the given number to the range between `min` and `max`.
     *
     * @param {number} num - Number to limit.
     * @param {number} min - Minimum value for number.
     * @param {number} max - Maximum value for number.
     *
     * @return {number} Number `num` limited to range between `min` and `max`.
     */
    const range = (num, min, max) => {
      const numToLimit = parseInt(num);
      return Math.min(Math.max(numToLimit, min), max);
    };

    return range(verbosityLevel, MIN_VERBOSITY, MAX_VERBOSITY);
  },
};

module.exports = verbosityLevels;
