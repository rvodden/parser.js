const calculator = require('../app');

/**
 * Sets up the various applications necessary to run end to end tests.
 *
 * @return {Promise} A promise to set up all the applications.
 */
function setupApps() {
  console.log('Setting up application.');
  return calculator.asyncListen(0).then((calculatorServer) => {
    this.calculatorServer = calculatorServer;
    const calculatorPort = this.calculatorServer.address().port;
    this.calculatorAddress = `http://localhost:${calculatorPort}`;
    this.calculatorUri = this.calculatorAddress + '/api';
  });
}


/**
 * Shuts down the applications. Intended to be run onces the end to end tests
 * have been completed.
 */
function teardownApps() {
  console.log('Tearing down application.');
  this.calculatorServer.close();
}

module.exports = {
  setupApps: setupApps,
  teardownApps: teardownApps,
  mochaHooks: {
    beforeAll: setupApps,
    afterAll: teardownApps,
  },
};

