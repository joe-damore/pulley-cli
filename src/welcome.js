const pulleyInfo = require('../package.json');
const colors = require('ansi-colors');
const figlet = require('figlet');

const log = require('./log/log.js');

/**
 * Sends a notice with options to specify that no formatting should be applied.
 *
 * @param {string} message - Message to send.
 */
const sendRaw = (message) => {
  log.sendNotice(message, {
    formatting: {
      raw: true,
    },
  });
};

/**
 * Renders the given title `title` using FIGfont.
 *
 * The output can be rendered using console.log or similar.
 *
 * @param {string} title - Title to be rendered.
 *
 * @returns {string} Title rendered with FIGfont.
 */
const getTitleText = (title) => {
  const titleFont = 'Varsity';
  let titleText;

  try {
    titleText = figlet.textSync(title, titleFont);
  }
  catch (err) {
    // If an error occurs, return an unstyled title.
    return title;
  }

  return titleText;
}

/**
 * Displays the Pulley CLI welcome message.
 */
const welcome = () => {
  /*
   * Get title text first.
   *
   * `getTitleText` makes a synchronous read operation, so we should get it
   * out of the way before outputting any text to the console.
   */
  const titleText = getTitleText('= Pulley =');

  sendRaw(colors.cyan(titleText));
  sendRaw(colors.cyan(` v${pulleyInfo.version}`));
  sendRaw('');
};

module.exports = welcome;
