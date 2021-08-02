const nock = require('nock');
const expressionEvaluator = require('../app');

/**
 * Sets up the various applications necessary to run end to end tests.
 *
 * @return {Promise} A promise to set up all the applications.
 */
function setupApps() {
  console.log('Setting up application.');
  // doesn't matter if these are actually available as they will be mocked
  this.parserAddress = 'http://localhost:3000';
  this.parserPath = '/api';

  this.calculatorAddress = 'http://localhost:3001';
  this.calculatorPath = '/api';

  const config = {
    parserAddress: this.parserAddress,
    calculatorAddress: this.calculatorAddress,
  };

  return expressionEvaluator.asyncListen(0, config).then((expressionEvaluatorServer) => {
    this.expressionEvaluatorServer = expressionEvaluatorServer;
    const expressionEvaluatorPort = this.expressionEvaluatorServer.address().port;
    this.expressionEvaluatorAddress = `http://localhost:${expressionEvaluatorPort}`;
    this.expressionEvaluatorUri = this.expressionEvaluatorAddress + '/api';
  });
}


/**
 * Shuts down the applications. Intended to be run onces the end to end tests
 * have been completed.
 */
function teardownApps() {
  console.log('Tearing down application.');
  this.expressionEvaluatorServer.close();
}

module.exports = {
  setupApps: setupApps,
  teardownApps: teardownApps,
  mochaHooks: {
    beforeAll: setupApps,
    afterAll: teardownApps,
  },
};

