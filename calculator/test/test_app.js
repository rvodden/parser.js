const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const calculator = require('../calculator');
const {InvalidExpression} = require('model');

const expect = chai.expect;

const singleNumbers = [
  {input: 12, output: 12},
  {input: -12, output: -12},
  {input: 1.234, output: 1.234},
];

describe('Calculator REST API:', function() {
  describe('When calculating single numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(function(singleNumber) {
      it(`Should return 200 and provide a valid object when given ${singleNumber.input}`, function() {
        const calculate = sinon.stub(calculator, 'calculate').returns({result: singleNumber.output});
        const testExpression = {expression: singleNumber.input};
        return request(app)
            .post('/api')
            .send(testExpression)
            .expect(200)
            .then((res) => {
              calculate.restore();
              sinon.assert.calledWith(calculate, testExpression);

              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('result').eql(singleNumber.output);
            });
      });
    });
  });

  it('Should return a 400 when the expression is invalid', function() {
    const calculate = sinon.stub(calculator, 'calculate').throws(
        new InvalidExpression('The expression is invalid.')
    );
    return request(app)
        .post('/api')
        .expect(400)
        .then(() => {
          calculate.restore();
          sinon.assert.calledOnce(calculate);
        });
  });
});
