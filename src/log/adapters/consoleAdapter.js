const colors = require('ansi-colors');
const moment = require('moment');

const Adapter = require('./adapter.js');
const types = require('../types.js');

/**
 * Returns the appropriate log function for the given message type.
 *
 * @param {number} messageType - Message type.
 *
 * @returns {function} Log function for message type.
 */
const getLogFunctionForType = (messageType) => {
  let logFunction = console.info;
  switch (messageType) {
    case types.WARNING:
      logFunction = console.warn;
      break;

    case types.ERROR:
      logFunction = console.error;
      break;
  }
  return logFunction;
};

/**
 * Returns the appropriate symbol for the given message options object.
 *
 * Symbols are small characters shown next to the log message to indicate
 * the type of message being displayed.
 *
 * This is closely tied to the message type, but when the `options.success`
 * flag is `true`, a success symbol is used regardless of message type.
 */
const getSymbolForMessageOptions = (options) => {
  // Always use the specified symbol if one is provided.
  if (options.formatting && options.formatting.symbol) {
    return options.formatting.symbol;
  }
  // If the options `success` flag is true, use a success-specific symbol.
  if (options.success) {
    return '✓';
  }

  let symbol = '-';
  switch (options.type) {
    // Use 'i' symbol for INFO and DEBUG messages.
    case types.INFO:
    case types.DEBUG:
      symbol = 'i';
      break;

    // Use '!' symbol for WARNING messages.
    case types.WARNING:
      symbol = '!';
      break;

    // Use 'x' symbol for ERROR messages.
    case types.ERROR:
      symbol = 'x';
      break;
  }

  return symbol;
};

/**
 * Returns the appropriate color functions for the given message options.
 *
 * @param {Object} options - Message options.
 *
 * @returns {Object} Object describing symbol and message colors for options.
 */
const getColorsForMessageOptions = (options) => {
  if (options.formatting.noColors) {
    return {
      symbol: undefined,
      message: undefined,
    };
  }

  let messageColors = {
    message: colors.white,
  };

  switch (options.type) {
    case types.DEBUG:
      messageColors.symbol = colors.cyan;
      break;

    case types.INFO:
      messageColors.symbol = colors.white;
      break;

    case types.NOTICE:
      messageColors.symbol = colors.gray;
      break;

    case types.WARNING:
      messageColors = {
        symbol: colors.yellow,
        message: colors.yellow,
      };
      break;

    case types.ERROR:
      messageColors = {
        symbol: colors.red,
        message: colors.red,
      };
      break;
  }

  // If 'options.success' is true, use green colors.
  // In theory this could allow green error message output -- weird!
  if (options.success) {
    messageColors.symbol = colors.green;
    messageColors.message = colors.green;
  }

  // Override with user-provided values if they exist.
  if (options.formatting.symbolColor) {
    messageColors.symbol = options.formatting.symbolColor;
  }

  if (options.formatting.messageColor) {
    messageColors.message = options.formatting.messageColor;
  }

  return messageColors;
};


/**
 * Console adapter for logging.
 *
 * Outputs message to console, in many cases with formatting.
 *
 * Formatting options can be passed to determine how (or if) message is
 * formatted.
 */
class ConsoleAdapter extends Adapter {

  /**
   * Constructor.
   *
   * Sets default formatting options.
   */
  constructor() {
    super();

    // Default formatting options for console output.
    this.defaultFormatting = {
      raw: false,
      noSymbol: false,
      noTime: false,
      noColors: false,
      symbol: undefined,
      symbolColor: undefined,
      messageColor: undefined,
    };

  }

  /**
   * Outputs message `message` to console with options `options`.
   *
   * @param {string} message - Message to display in console.
   * @param {Object=} options - Message options.
   */
  send(message, options) {
    // TODO Output date and/or time with log message
    const sendOptions = {
      formatting: this.defaultFormatting,
      ...options,
    };

    const logFunction = getLogFunctionForType(sendOptions.type);

    // Output with no formatting and return if `options.formatting.raw` is true.
    if (sendOptions.formatting.raw) {
      logFunction(message);
      return;
    }

    const colors = getColorsForMessageOptions(sendOptions);
    const symbol = getSymbolForMessageOptions(sendOptions);

    /**
     * Returns a formatted symbol character for the message being sent.
     *
     * Formatting occurs according to the given `formatting` options.
     *
     * @returns {string} Formatted symbol string for message.
     */
    const formattedSymbol = (() => {
      if (sendOptions.formatting.noSymbol) {
        return '';
      }
      if (sendOptions.formatting.noColors) {
        return `${symbol} : `
      }
      return `${colors.symbol(symbol)} : `;
    })();

    /**
     * Returns a formatted string for the message being sent.
     *
     * Formatting occurs according to the given `formatting` options.
     *
     * @returns {string} Formatted string for message.
     */
    const formattedMessage = (() => {
      if (sendOptions.formatting.noColors) {
        return message;
      }
      return colors.message(message);
    })();

    /**
     * Returns a formatted string for the message timestamp.
     *
     * Formatting occurs according to the given `formatting` options;
     * if `formatting.noTime` is true, an empty string is returned.
     *
     * @returns {string} Formatted timestamp string for message.
     */
    const formattedTime = (() => {
      if (sendOptions.formatting.noTime) {
        return '';
      }
      const timestamp = `${moment().format('hh:mm:ss A')} : `;
      if (sendOptions.formatting.noColors) {
        return timestamp;
      }
      return colors.message(timestamp);
    })();

    logFunction(`${formattedSymbol}${formattedTime}${formattedMessage}`);
  }

}

module.exports = ConsoleAdapter;
