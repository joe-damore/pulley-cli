/**
 * @file Public logging interface.
 */
const types = require('./types.js');
const verbosity = require('./verbosity.js');

/**
 * Maps verbosity levels to the message types that they should permit.
 */
const verbosityTypeMap = {};

// SILENT verbosity level should not output any messages.
verbosityTypeMap[verbosity.SILENT] = [];

// NORMAL verbosity level should output notices, warnings, and errors.
verbosityTypeMap[verbosity.NORMAL] = [
  types.NOTICE,
  types.WARNING,
  types.ERROR,
],

// INFO verbosity level should output info, notices, warnings, and errors.
verbosityTypeMap[verbosity.INFO] = [
  types.INFO,
  types.NOTICE,
  types.WARNING,
  types.ERROR,
],

// DEBUG verbosity level should output everything.
verbosityTypeMap[verbosity.DEBUG] = [
  types.DEBUG,
  types.INFO,
  types.NOTICE,
  types.WARNING,
  types.ERROR,
];

/**
 * Object that provides a public interface for sending log messages.
 *
 * Adapters should be added using the `addAdapter` method. Once added, all
 * applicable messages will be delivered using all added adapters.
 *
 * Messages can be sent using the `send` method and its variants, `sendInfo`,
 * `sendError`, etc.
 */
const log = {

  /// Array of log adapter objects which handle messages sent by this object.
  adapters: [],

  /// Current log verbosity level; typically set at app startup.
  verbosity: verbosity.DEBUG,

  /// Re-export of message types for external use.
  types: types,

  /// Re-export of message verbosity levels for external use.
  verbosityLevels: verbosity,

  /**
   * Adds the given log adapter instance `adapter`.
   *
   * Once added, all applicable messages will be dispatched to the log adapter.
   *
   * @param {Object} adapter - Log adapter instance to add.
   */
  addAdapter: function(adapter) {
    this.adapters.push(adapter);
  },

  /**
   * Delivers the given message and options to all log adapters if applicable.
   *
   * Only messages that are allowed given this object's `verbosity` property
   * are dispatched.
   *
   * This method is meant to be private and should not be invoked externally.
   *
   * @param
   */
  _dispatch: function(message, options) {
    if (!verbosityTypeMap[this.verbosity].includes(options.type)) {
      // Short-circuit if verbosity level does not permit dispatching message.
      return;
    }
    this.adapters.forEach((adapter) => {
      adapter.send(message, options);
    });
  },

  /**
   * Logs the message `message`.
   *
   * Options can be supplied to describe the type of message being sent and
   * to configure the output in adapter-specific ways.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   * @param {number=} options.type - Message type. Defaults to NOTICE.
   */
  send: function(message, options = {}) {
    const defaultOptions = {
      type: types.NOTICE,
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the debug message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` is ignored; all messages sent using this method
   * are sent as DEBUG-type messages.
   *
   * DEBUG-type messages should be used to display technical information that
   * would be used for advanced troubleshooting or debugging.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendDebug: function(message, options = {}) {
    const overrideOptions = {
      type: types.DEBUG,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the info message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` is ignored; all messages sent using this method
   * are sent as INFO-type messages.
   *
   * INFO-type messages should be used to display purely informational messages
   * that may not be immediately useful in normal circumstances.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendInfo: function(message, options = {}) {
    const overrideOptions = {
      type: types.INFO,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the notice message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` is ignored; all messages sent using this method
   * are sent as NOTICE-type messages.
   *
   * NOTICE-type messages should be used to display regular messages to the
   * user. These messages would be shown to users in most circumstances and
   * are generally useful or necessary for regular operation of the CLI.
   *
   * NOTICE-type messages are the default type of message, and are sent when
   * using the `send()` method without specifying any message type.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendNotice: function(message, options = {}) {
    const overrideOptions = {
      type: types.NOTICE,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the warning message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` is ignored; all messages sent using this method
   * are sent as WARNING-type messages.
   *
   * WARNING-type messages should be used to display warning messages
   * messages that indicate that something may be wrong but is not immediately
   * harmful enough to halt the current operation.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendWarning: function(message, options = {}) {
    const overrideOptions = {
      type: types.WARNING,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the error message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` is ignored; all messages sent using this method
   * are sent as ERROR-type messages.
   *
   * ERROR-type messages should be used to display error messages and details
   * for operations which fail mid-progress or which complete with a failure
   * result.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendError: function(message, options = {}) {
    const overrideOptions = {
      type: types.ERROR,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this._dispatch(message, finalOptions);
  },

  /**
   * Logs the success message `message`.
   *
   * Options can be supplied to configure the message output in adapter-specific
   * ways.
   *
   * Note that `options.type` and `options.success` are ignored; all messages
   * sent using this method are sent as NOTICE-type messages with the `success`
   * option set to `true`.
   *
   * Adapters are not guaranteed to handle messages with the `success` option
   * set to `true`, in which case the messages will be treated like a typical
   * NORMAL-type message.
   *
   * Success messages should be used to indicate to the user that an operation
   * has been completed successfully.
   *
   * @param {string} message - Message to be sent.
   * @param {Object=} options - Message options.
   */
  sendSuccess: function(message, options = {}) {
    const overrideOptions = {
      success: true,
    };

    const finalOptions = {
      ...options,
      ...overrideOptions,
    };

    this.sendNotice(message, finalOptions);
  }

};

module.exports = log;
