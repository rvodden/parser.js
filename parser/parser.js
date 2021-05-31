// mygenerator.js
var Parser = require("jison").Parser;
var fs = require("fs");

var grammar = fs.readFileSync("parser.jison", "utf8");
var parser = new Parser(grammar);

// generate source, ready to be written to disk
var parserSource = parser.generate();

exports.parser = parser