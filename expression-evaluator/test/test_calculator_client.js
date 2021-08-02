const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiNock = require('chai-nock');
const nock = require('nock');
const expect = chai.expect;

const CalculatorClient = require('../calculator_client');

chai.use(chaiHttp);
chai.use(chaiNock);

const calculatorAddress = 'http://localhost:3000';
const calculatorPath = '/api';

const singleNumbers = [12, -12, 1.234];

describe('CalculatorClient', function() {
  describe('Should send requests to Calculator', function() {
    describe('Single numbers', function() {
      // eslint-disable-next-line mocha/no-setup-in-describe
      singleNumbers.forEach((singleNumber) => {
        it(`${singleNumber} should work.`, function() {
          const calculatorMock = nock(calculatorAddress).post(calculatorPath)
              .reply(200, {value: singleNumber});
          const calculatorClient = new CalculatorClient(calculatorAddress + calculatorPath);

          return calculatorClient.calculate({expression: singleNumber}).then((result) => {
            calculatorMock.isDone();
            expect(result).to.have.property('value').eql(singleNumber);
          });
        });
      });
    });
  });
  it('Should throw an exception when Calculator returns an error', function() {
    const calculatorMock = nock(calculatorAddress).post(calculatorPath)
        .reply(400);
    const calculatorClient = new CalculatorClient(calculatorAddress + calculatorPath);
    return calculatorClient.calculate({expression: 12}).then(
        () => Promise.reject(new Error('Calculator should have thrown an exception')),
        (err) => {
          expect(err).not.to.be.undefined;
          calculatorMock.isDone();
        });
  });
});
