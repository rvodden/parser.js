var assert = require('mocha')
var expect = require('chai').expect;
var should = require('chai').should();

var parser = require('../parser').parser

let single_digit_tests = [
    {input: '12', response: '{"expression": 12 }'},
    {input: '-12', response: '{"expression": -12 }'}
]

describe('Parsing single numbers:', () => {
    single_digit_tests.forEach(({input, response}) => {
        it(`Should be able to read "${input}"`, () => {
            result = parser.parse(input)
            expect(result).to.equal(response)
        })
    })
})