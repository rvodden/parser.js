// mygenerator.js
const {Expression, InvalidExpression} = require('model');

/**
 * Converts a string to an Expression object,
 *
 * @param {string} str the string to convert.
 *
 * @return {Expression} the parsed expression object.
 */
function parse(str) {
  const num = Number(str);
  if ( str === '' || isNaN(num) ) {
    throw new InvalidExpression(`'{str}' is not a number.`);
  }
  return new Expression(num);
}

module.exports = exports = {
  parse: parse,
  default: parse,
};
