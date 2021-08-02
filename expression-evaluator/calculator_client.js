const axios = require('axios');

class CalculatorClient {
  constructor(calculatorAddress) {
    this.calculatorAddress = calculatorAddress;
  }

  calculate(expression) {
    return axios.post(this.calculatorAddress, expression).then(function(response){
      return response.data;
    });
  }
}

module.exports = CalculatorClient;
