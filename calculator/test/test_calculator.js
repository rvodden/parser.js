const chai = require("chai");
const expect = chai.expect;

const calculate = require("../calculator").calculate;

let single_numbers = [12, -12, 1.234];

describe("Calculator", function () {
  describe("Should work for a single number examples:", function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    single_numbers.forEach((single_number) => {
      it(`Should work for ${single_number}`, function () {
        const result = calculate({
          expression: single_number,
        });
        expect(result).to.be.an("object");
        expect(result).to.have.property("result").eq(single_number);
      });
    });
  });
});
