const testApi = require('test-api');
const ui = require('ui')

function setupApps () {
    return testApi.setupApps().then(function () {

    })
}

module.exports = {
    mochaHooks: {
        beforeAll: setupApps
        afterAll: teardownApps
    }
}
