/**
 * @file Map structure of log message types.
 */

/**
 * Map of log message types.
 */
const logTypes = {
  INFO: 0, /// Informational messages that are not required for regular use.
  DEBUG: 1, /// Technical information useful for debugging or troubleshooting.
  NOTICE: 2, /// Normal messages that are useful or required for regular use.
  WARNING: 3, /// Warning messages that indicate something may be wrong.
  ERROR: 4, /// Error messages that indicate something has gone wrong.
};

module.exports = logTypes;
