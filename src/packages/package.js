/**
 * @file Package class to represent retrieved Pulley packages.
 */

const sanitize = require('sanitize-filename');

// TODO Consider whether or not this class or similar belongs in `pulley-core`.

/**
 * Represents a retrieved package.
 *
 * Contains a `name` which represents the name of the package, and a
 * `stream` which contains a Vinyl stream object containing the package
 * contents.
 */
class Package {

  /**
   * Constructor.
   *
   * @param {string} name - Package name. Gets `Package.filenameSafe` applied.
   * @param {Object} stream - Vinyl stream for retrieved package contents.
   */
  constructor(name, stream) {
    this.name = Package.filenameSafe(name); // Name should be filename-safe.
    this.stream = stream;
  }

  /**
   * Returns a filename-safe version of the given-string.
   *
   * The output can be used for file and path names.
   *
   * @param {string} str - String to make filename-safe.
   *
   * @returns {string} Filename-safe version of `str`.
   */
  static filenameSafe(str) {
    return sanitize(str)
      .replace(/\s+/g, ' ')
      .replace(/ /g, '_');
  }

}

module.exports = Package;
