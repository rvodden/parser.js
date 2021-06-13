const axios = require('axios');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Expression Evaluator Rest End-to-End Tests', function() {
  describe('Single Numbers:', function() {
    const singleNumbers = [
      {input: '12', output: 12},
      {input: '-12', output: -12},
      {input: '1.234', output: 1.234},
    ];

    singleNumbers.forEach(({input, output}) => {
      it(`should work for ${input}`, function() {
        return axios.post(this.expressionEvaluatorUri, {expression: input})
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.data).to.have.property('result').eq(output);
            });
      });
    });
  });
});
