const boxen = require('boxen');
const { log, colors } = require('../log');

/**
 * Send a message without any formatting.
 *
 * @param {string} message - Message to send.
 */
const sendRaw = (message) => {
  log.send(message, {
    formatting: {
      raw: true,
    }
  });
};

/**
 * Logs information about the given package.
 *
 * @param {Object} packageInstance - Package to display.
 */
const displayPackageInfo = (packageInstance) => {
  const lines = [
    `${colors.bold(packageInstance.name)} from ${colors.bold(packageInstance.source)} source`,
  ];

  sendRaw(boxen(lines.join('\n'), {
    borderStyle: 'doubleSingle',
    borderColor: 'cyan',
    margin: 1,
    padding: 1,
  }));
};

module.exports = displayPackageInfo;
