const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Expression Evaluator Rest End-to-End Tests',
    function(done) {
      describe('Invalid Expressions:', () => {
        const invalidExpressions = [
          {input: ''},
          {input: '1234 1234'},
          {input: '123 123'},
          {input: 'three'},
          {input: '123.-12'},
        ];
        invalidExpressions.forEach(({input, output}) => {
          it(`should return a 400 with and error message on '${input}'.`,
              function() {
                return chai.request(this.expressionEvaluatorUri)
                    .post('/')
                    .send({expression: input})
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
