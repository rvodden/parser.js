'use strict';

const expect = require('chai').expect;
const model = require('model');

const parse = require('../parser.js').parse;

const singleNumbers = [
  {input: '12', output: 12},
  {input: '-12', output: -12},
  {input: '1.234', output: 1.234},
];

const invalidExpressions = ['', '1234 1234', '123, 123', 'three', '123.-12'];

describe('Expression Parser:', function(done) {
  describe('Parsing single numbers:', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(({input, output}) => {
      it(`Should be able to read "${input}"`, function(done) {
        const result = parse(input);
        expect(result).to.eql({expression: output});
        done();
      });
    });
  });

  describe('Handling invalid expression:', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    invalidExpressions.forEach((invalidExpression) => {
      it(`Should fail cleanly on ${invalidExpression}`, function(done) {
        expect(() => parse(invalidExpression)).to.throw(
            model.InvalidExpression
        );
        done();
      });
    });
  });
});

module.exports = {
  singleNumbers: singleNumbers,
  invalidExpressions: invalidExpressions,
};
