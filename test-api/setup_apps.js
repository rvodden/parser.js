const calculator = require('calculator');
const parser = require('parser');
const expressionEvaluator = require('expression-evaluator');

/**
 * Sets up the various applications necessary to run end to end tests.
 *
 * @return {Promise} A promise to set up all the applications.
 */
function setupApps() {
  console.log('Setting up applications');
  return Promise.all(
      [calculator.asyncListen(0),
        parser.asyncListen(0)]
  ).then(([calculatorServer, parserServer]) => {
    this.calculatorServer = calculatorServer;
    this.parserServer = parserServer;

    const parserPort = this.parserServer.address().port;
    this.parserAddress = `http://localhost:${parserPort}`;
    this.parserUri = this.parserAddress + '/api';

    const calculatorPort = this.calculatorServer.address().port;
    this.calculatorAddress = `http://localhost:${calculatorPort}`;
    this.calculatorUri = this.calculatorAddress + '/api';

    return expressionEvaluator.asyncListen(0, {
      parser_address: this.parserAddress,
      calculator_address: this.calculatorAddress,
    }).then((expressionEvaluatorServer) => {
      this.expressionEvaluatorServer = expressionEvaluatorServer;
      this.expressionEvaluatorAddress = `http://localhost:${this.expressionEvaluatorServer.address().port}`;
      this.expressionEvaluatorUri = this.expressionEvaluatorAddress + '/api';
    });
  });
}


/**
 * Shuts down the applications. Intended to be run onces the end to end tests
 * have been completed.
 */
function teardownApps() {
  console.log('Tearing down applications');
  this.expressionEvaluatorServer.close();
  this.calculatorServer.close();
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

