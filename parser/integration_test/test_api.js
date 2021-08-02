const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const singleNumbers = [
  {input: {expression: '12'}, output: {expression: 12}},
  {input: {expression: '-12'}, output: {expression: -12}},
  {input: {expression: '1.234'}, output: {expression: 1.234}},
];

const invalidExpressions = [
  {input: {expression: ''}},
  {input: {expression: '1234 1234'}},
  {input: {expression: '123 123'}},
  {input: {expression: 'three'}},
  {input: {expression: '123.-12'}},
  {input: {turnip: 12}},
];

describe('Parser Integration Tests', function() {
  describe('Single Digit Numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(function(singleNumber) {
      it(`Should work when given ${singleNumber.input.expression}`, function() {
        return axios.post(this.parserUri, singleNumber.input)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.data).to.have.property('expression').eq(singleNumber.output.expression);
            });
      });
    });
  });

  describe('Invalid Expressions:', function() {
    invalidExpressions.forEach((invalidExpression) => {
      it(`should return a 400 with and error message on '${invalidExpression.input}'.`,
          function() {
            return chai.request(this.parserUri)
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
