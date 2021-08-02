const model = require('model');

/**
 * Takes an expression object and returns a result object containing the result of the expression.
 *
 * @param {!Expression} expression The expression to evaluate.
 * @return {!Result} result The result of the provider expression once
 * evaluated.
 */
function calculate(expression) {
  const result = expression.expression;
  if (typeof result == 'undefined') {
    throw new model.InvalidExpression(`The expression '${expression}' is not valid.`);
  }
  return new model.Result(result);
}

module.exports = {
  default: calculate,
  calculate: calculate,
};
