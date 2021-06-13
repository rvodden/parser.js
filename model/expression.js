class Expression {
  constructor(value) {
    this.expression = value;
  }
}

/**
 * Thrown to indicate that an expression is not valid.
 *
 */
class InvalidExpression extends Error {
  /**
   * @param {string} message An explanation of how the expression is not
   * valid.
   * @param {hash} hash The lexical or parsal hash returned by Jison.
   */
  constructor(message) {
    super(message);
  }
}

class Result {
  constructor(value) {
    this.result = value;
  }
}


module.exports = exports = {
  InvalidExpression: InvalidExpression,
  Expression: Expression,
  Result: Result,
  default: Expression,
};
