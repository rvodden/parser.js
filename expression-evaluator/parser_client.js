const axios = require('axios');

class ParserClient {
  constructor(parserAddress) {
    this.parserAddress = parserAddress;
  }

  parse(expression) {
    return axios.post(this.parserAddress, expression).then(function(response) {
      return response.data;
    });
  }
}

module.exports = ParserClient;
