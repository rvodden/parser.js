const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const singleNumbers = [
  {input: {expression: 12}, output: {result: 12}},
  {input: {expression: -12}, output: {result: -12}},
  {input: {expression: 1.234}, output: {result: 1.234}},
];

const invalidExpressions = [
  {input: {turnip: 12}},
];

describe('Calculator Integration Tests', function() {
  describe('Single Digit Numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(function(singleNumber) {
      it(`Should work when given ${singleNumber.input.expression}`, function() {
        return axios.post(this.calculatorUri, singleNumber.input)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.data).to.have.property('result').eq(singleNumber.output.result);
            });
      });
    });
  });


  describe('Invalid Expressions:', function() {
    invalidExpressions.forEach((invalidExpression) => {
      it(`should return a 400 with and error message on '${invalidExpression.input}'.`,
          function() {
            return chai.request(this.calculatorUri)
                .post('/')
                .send(invalidExpression)
                .then((response) => {
                  expect(response).to.have.status(400);
                  expect(response.body).to.be.an('object');
                  expect(response.body).to.have.property('error');
                  expect(response.body.error).to.be.a('string');
                });
          });
    });
  });
});
