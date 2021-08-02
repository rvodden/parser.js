const parser = require('../app');

/**
 * Sets up the various applications necessary to run end to end tests.
 *
 * @return {Promise} A promise to set up all the applications.
 */
function setupApps() {
  console.log('Setting up application.');
  return parser.asyncListen(0).then((parserServer) => {
    this.parserServer = parserServer;
    const parserPort = this.parserServer.address().port;
    this.parserAddress = `http://localhost:${parserPort}`;
    this.parserUri = this.parserAddress + '/api';
  });
}


/**
 * Shuts down the applications. Intended to be run onces the end to end tests
 * have been completed.
 */
function teardownApps() {
  console.log('Tearing down application.');
  this.parserServer.close();
}

module.exports = {
  setupApps: setupApps,
  teardownApps: teardownApps,
  mochaHooks: {
    beforeAll: setupApps,
    afterAll: teardownApps,
  },
};

