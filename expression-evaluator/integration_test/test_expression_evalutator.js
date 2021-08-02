process.env.NODE_ENV = 'test';

const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiNock = require('chai-nock');
const nock = require('nock');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
chai.use(chaiNock);
axios.defaults.adapter = require('axios/lib/adapters/http');

const singleNumbers = [
  {
    input: {expression: '10'},
    output: {result: 10},
  },
  {
    input: {expression: '-12'},
    output: {result: -12},
  },
  {
    input: {expression: '1.234'},
    output: {result: 1.234},
  },
];

const invalidExpressions = [
  {input: ''},
  {input: '1234 1234'},
  {input: '123 123'},
  {input: 'three'},
  {input: '123.-12'},
];

describe('Expression Evaluator API', function() {
  describe('Single Numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(({input, output}) => {
      it(`Should evaluate '${input.expression}'.`, function() {
        const parser = nock(this.parserAddress).post(this.parserPath)
            .reply(200, input);
        const calculator = nock(this.calculatorAddress).post(this.calculatorPath)
            .reply(200, output);
        return axios.post(this.expressionEvaluatorUri, input)
            .then((res) => {
              expect(parser).to.have.been.requested;
              expect(calculator).to.have.been.requested;
              expect(res).to.have.status(200);
              expect(res).to.have.property('data');
              expect(res.data).to.be.an('object');
              expect(res.data).to.have.property('result').eql(output.result);
            }).catch((err) => {
                assert.fail(`error was raised: ${err}`);
            });
      });
    });
  });

  describe('Invalid Expressions:', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    invalidExpressions.forEach(({input}) => {
      it(`Should fail cleanly on '${input}'`, function() {
        const parser = nock(this.parserAddress).post(this.parserPath)
            .reply(400, {error: 'This is a mock error.'});
        return axios.post(this.expressionEvaluatorUri, {
          expression: input,
        }).then((res) => {
          assert.fail('A successful response was received from an errored request.');
        }).catch((err) => {
          expect(parser).to.have.been.requested;
          expect(err.response).to.have.status(400);
          expect(err.response.data).to.be.an('object');
          expect(err.response.data).to.have.property('error');
          expect(err.response.data.error).to.be.a('string');
        });
      });
    });
  });
});
