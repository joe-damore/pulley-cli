const pulley = require('./pulley.js');
const welcome = require('./welcome.js');

const { log, verbosity } = require('./log');
const { ConsoleAdapter } = require('./log/adapters');

const { validatePulleyfile } = require('./pulleyfile/schema');

const errorCodes = require('./errorCodes.js');
const exit = require('./exit.js');
const pulleyfile = require('./pulleyfile/loadPulleyfile.js');

const Package = require('./packages/package.js');
const displayPackage = require('./packages/displayPackageInfo.js');

const loadBundler = require('./bundlers/loadBundler.js');
const loadSource = require('./sources/loadSource.js');
const { validateSource } = require('./sources/validateSource.js');

/**
 * Configures the log according to settings passed by command line arguments.
 */
const configureLog = () => {
  // TODO Add file log adapter if requested by command line arguments.
  log.verbosity = verbosity.get(pulley.verbose);
  log.addAdapter(new ConsoleAdapter());
};

/**
 * Loads the Pulleyfile.
 *
 * Promise resolves to null if Pulleyfile load failure occurs.
 *
 * @returns {Promise|null} Resolves to Pulleyfile data object, or null.
 */
const loadPulleyfile = async () => {
  let pulleyData = null;
  try {
    pulleyData = await pulleyfile(pulley.pulleyfile);
  }
  catch (err) {
    return null;
  }
  return pulleyData;
};

/**
 * Main program entrypoint.
 *
 * Called after command line arguments have been parsed but before any other
 * execution has started.
 */
const main = async function() {

  /*
   * Perform first-time- log setup, and show welcome greeting.
   */
  configureLog();
  welcome();

  /**
   * Load Pulleyfile data, or exit on failure.
   */
  // TODO Use different exit code if failure is YAML parse error.
  const pulleyfile = await loadPulleyfile();
  if (!pulleyfile) {
    exit(errorCodes.ERR_NO_PULLEYFILE);
  }

  /**
   * Validate Pulleyfile schema, and exit on failure.
   */
  const results = validatePulleyfile(pulleyfile);
  if (results.errors && results.errors.length > 0) {
    exit(errorCodes.ERR_PULLEYFILE_VALIDATION);
  }

  const retrievedPackages = [];

  for (let i = 0; i < pulleyfile.packages.length; i += 1) {
    const pulleyPackage = pulleyfile.packages[i];
    displayPackage(pulleyPackage);

    const SourceClass = loadSource(pulleyPackage.source);
    const sourceInstance = new SourceClass(pulleyPackage.options);

    await validateSource(sourceInstance, pulleyPackage);
    const result = await sourceInstance.fetch();

    retrievedPackages.push(new Package(pulleyPackage.name, result));
  }

  const BundlerClass = loadBundler(pulleyfile.bundler);
  const bundlerInstance = new BundlerClass();

  bundlerInstance.bundle(retrievedPackages, './out');

};

main();
