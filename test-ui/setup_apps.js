const testApi = require('test-api');
const ui = require('ui');

function setupApps() {
  return testApi.setupApps(context).then(() => {
    return ui.asyncListen().then((server) => {
      this.uiServer = server;
      const uiPort = this.uiServer.address().port;
      this.uiAddress = `http://localhost:${uiPort}`;
      this.uiUri = this.uiAddress;
    });
  });
}

function teardownApps() {
  const context = this;
  testApi.teardownApps(context);
  this.uiServer.close();
}

module.exports = {
  mochaHooks: {
    beforeAll: setupApps,
    afterAll: teardownApps,
  },
};
