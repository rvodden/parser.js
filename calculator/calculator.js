const model = require('model');

/**
 * Takes an expression object and returns a result object.
 *
 * @param {!Expression} expression The expression to evaluate.
 * @return {!Result} result The result of the provider expression once
 * evaluated.
 */
function calculate(expression) {
  const result = expression.expression;
  return new model.Result(result);
}

module.exports = {
  default: calculate,
  calculate: calculate,
};
