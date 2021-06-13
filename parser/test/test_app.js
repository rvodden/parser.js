process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

const singleNumbers = require('./test_parser').singleNumbers;
const invalidExpressions = require('./test_parser').invalidExpressions;

chai.use(chaiHttp);
describe('Parser Rest API', function() {
  before(function() {
    this.parserServer = app.listen(0);
    this.parserPort = this.parserServer.address().port;
    this.parserAddress = `http://localhost:${this.parserPort}`;
    this.parserUri = this.parserAddress + '/api';
  });

  describe('Single Numbers', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    singleNumbers.forEach(({input, output}) => {
      it(`Should parse single ${input}`, function(done) {
        chai
            .request(this.parserUri)
            .post('/')
            .send({
              expression: input,
            })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('expression').eql(output);
              done();
            });
      });
    });
  });

  describe('Invalid Expressions:', function() {
    // eslint-disable-next-line mocha/no-setup-in-describe
    invalidExpressions.forEach((invalidExpression) => {
      it(`The expression '${invalidExpression}' should ` +
          `return 400 and provide an error message,`, function(done) {
        chai
            .request(this.parserUri)
            .post('/')
            .send({
              expression: invalidExpression,
            })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('error');
              expect(res.body.error).to.be.a('string');
              done();
            });
      });
    });
  });
});
