class ExpressionEvaluator {
  constructor(parserClient, calculatorClient) {
    this.parserClient = parserClient;
    this.calculatorClient = calculatorClient;
  }

  evaluate(request) {
    return this.parserClient.parse(request).then((expression) => {
      return this.calculatorClient.calculate(expression);
    });
  }
}

module.exports = ExpressionEvaluator;
