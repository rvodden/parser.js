const puppeteer = require('puppeteer');
const {expect} = require('chai');


before(() => {
  return puppeteer.launch().then((browser) => {
    this.browser = browser;
  });
});

describe('The Expression Evaluation End to End Experience.', function() {
  it('Should pass', function(done) {
    return this.browser.newPage().then((page) => {
      expect(true).to.be(true);
      done();
    });
  });
});
