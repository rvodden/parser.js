process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiNock = require('chai-nock');
const nock = require('nock');
const expect = chai.expect;
const app = require('../app');


chai.use(chaiHttp);
chai.use(chaiNock);

const singleNumbers = [
  {
    input: '10',
    output: 10,
  },
  {
    input: '-12',
    output: -12,
  },
  {
    input: '1.234',
    output: 1.234,
  },
];

const invalidExpressions = [
  {input: ''},
  {input: '1234 1234'},
  {input: '123 123'},
  {input: 'three'},
  {input: '123.-12'},
];

const parserAddress = 'http://localhost:3000';
const calculatorAddress = 'http://localhost:3001';
const parserPath = '/api';
const calculatorPath = '/api';
const apiPath = '/api';


describe('Expression Evaluator API', function() {
  before( function() {
    app.setup({
      parser_address: parserAddress,
      calculator_address: calculatorAddress,
    });
  });

  describe('Single Numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(({input, output}) => {
      it(`Should evaluate '${input}'.`, function(done) {
        const parser = nock(parserAddress).post(parserPath)
            .reply(200, {expression: output});
        const calculator = nock(calculatorAddress).post(calculatorPath)
            .reply(200, {value: output});
        chai.request(app)
            .post(apiPath)
            .send({
              expression: input,
            })
            .end((err, res) => {
              expect(parser).to.have.been.requested;
              expect(calculator).to.have.been.requested;
              expect(res).to.have.status(200);
              expect(res).to.have.property('body');
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('value').eql(output);
            });
        done();
      });
    });
  });

  describe('Invalid Expressions:', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    invalidExpressions.forEach((invalidExpression) => {
      it(`Should fail cleanly on '${invalidExpression.input}'`, function() {
        const parser = nock(parserAddress).post(parserPath)
            .reply(400, {error: 'This is a mock error.'});
        chai.request(app)
            .post(apiPath)
            .send({
              expression: invalidExpression.input,
            })
            .then((err, res) => {
              expect(parser).to.have.been.requested;
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.be.a('string');
            });
      });
    });
  });
});
