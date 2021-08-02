const chai = require('chai');
const expect = chai.expect;

const calculate = require('../calculator').calculate;

const singleNumbers = [12, -12, 1.234];

describe('Calculator', function () {
  describe('Should work for a single number examples:', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach((singleNumber) => {
      it(`Should work for ${singleNumber}`, function() {
        const result = calculate({
          expression: singleNumber,
        });
        expect(result).to.be.an('object');
        expect(result).to.have.property('result').eq(singleNumber);
      });
    });
  });
});
