const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiNock = require('chai-nock');
const nock = require('nock');
const expect = chai.expect;

const ParserClient = require('../parser_client');

chai.use(chaiHttp);
chai.use(chaiNock);

const parserAddress = 'http://localhost:3000';
const parserPath = '/api';

const singleNumbers = [
  {input: '12', output: 12},
  {input: '-12', output: -12},
  {input: '1.234', output: 1.234},
];

describe('ParserClient', function() {
  describe('Should send requests to Parser', function() {
    describe('Single numbers', function() {
      // eslint-disable-next-line mocha/no-setup-in-describe
      singleNumbers.forEach((singleNumber) => {
        it(`'${singleNumber.input}' should work.`, function() {
          const parserMock = nock(parserAddress).post(parserPath)
              .reply(200, {expression: singleNumber.output});
          const parserClient = new ParserClient(parserAddress + parserPath);

          return parserClient.parse({expression: singleNumber.input}).then((result) => {
            parserMock.isDone();
            expect(result).to.have.property('expression').eql(singleNumber.output);
          });
        });
      });
    });
  });
  it('Should throw an exception when Parser returns an error', function() {
    const parserMock = nock(parserAddress).post(parserPath)
        .reply(400);
    const parserClient = new ParserClient(parserAddress + parserPath);
    return parserClient.parse({expression: '12'}).then(
        () => Promise.reject(new Error('Calculator should have thrown an exception')),
        (err) => {
          expect(err).not.to.be.undefined;
          parserMock.isDone();
        });
  });
});
