/**
 * @file Base log adapter class.
 */

/**
 * Base log adapter class.
 *
 * Log adapters simply consume a message and output it to the desired target.
 */
class Adapter {

  /**
   * Sends the given message to the desired target.
   *
   * An `options` object describes the type of message being sent, and may
   * include additional arbitrary metadata that can be used to further transform
   * the message.
   *
   * @param {string|Object} message - Message string or object.
   * @param {Object} options - Message options.
   */
  send(message, options) {
    throw new Error('send() not implemented for Adapter');
  }

};

module.exports = Adapter;
