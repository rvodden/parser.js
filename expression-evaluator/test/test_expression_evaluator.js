const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const ExpressionEvaluator = require('../expression_evaluator');

const singleNumbers = [
  {input: '12', output: 12},
  {input: '-12', output: -12},
  {input: '1.234', output: 1.234},
];

describe('ExpressionEvaluator', function() {
  describe('Should call ParserClient, then send the result to CalculatorClient', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(function(singleNumber) {
      it(`should handle '${singleNumber.input}'`, function() {
        const fakeParserClient = {};
        const fakeParserResult = {expression: singleNumber.output}
        fakeParserClient.parse = sinon.fake.resolves({expression: fakeParserResult});
        const fakeCalculatorClient = {};
        fakeCalculatorClient.calculate = sinon.fake.resolves({result: singleNumber.output});

        const expressionEvaluator = new ExpressionEvaluator(fakeParserClient, fakeCalculatorClient);
        return expressionEvaluator.evaluate({expression: singleNumber.input}).then(function(result) {
          expect(result).to.have.property('result').eql(singleNumber.output);
          expect(fakeParserClient.parse.callCount).to.be.eql(1);
          expect(fakeCalculatorClient.calculate.callCount).to.be.eql(1);
        });
      });
    });
  });
  it('Should throw an error when ParserClient throws an error', function() {
    const fakeParserClient = {};
    fakeParserClient.parse = sinon.fake.rejects(new Error('This is a test error'));
    const fakeCalculatorClient = {};
    fakeCalculatorClient.calculate = sinon.fake.resolves({result: 12});

    const expressionEvaluator = new ExpressionEvaluator(fakeParserClient, fakeCalculatorClient);
    return expressionEvaluator.evaluate({expression: '12'}).then(
        () => Promise.reject(new Error('Expression Evaluator should have thrown an error')),
        (err) => {
          expect(err).not.to.be.undefined;
          expect(fakeParserClient.parse.callCount).to.eql(1);
          expect(fakeCalculatorClient.calculate.callCount).to.eql(0);
        }
    );
  });
  it('Should throw an error when CalculatorClient throws an error', function() {
    const fakeParserClient = {};
    fakeParserClient.parse = sinon.fake.resolves({expression: 12});
    const fakeCalculatorClient = {};
    fakeCalculatorClient.calculate = sinon.fake.rejects(new Error('This is a test error'));

    const expressionEvaluator = new ExpressionEvaluator(fakeParserClient, fakeCalculatorClient);
    return expressionEvaluator.evaluate({expression: '12'}).then(
        () => Promise.reject(new Error('Expression Evaluator should have thrown an error')),
        (err) => {
          expect(err).not.to.be.undefined;
          expect(fakeParserClient.parse.callCount).to.eql(1);
          expect(fakeCalculatorClient.calculate.callCount).to.eql(1);
        }
    );
  });
});
