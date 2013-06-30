var path = require('path'),
    util = require('util'),
    console = require('console'),
    fs = require('fs');

var bless = {
    version: [3, 0, 3],
    Parser: require('../bless/parser').Parser,
    cleanup: require('../bless/parser').cleanup
};

for (var k in bless) { exports[k] = bless[k] }
