var path = require('path'),
    util = require('util'),
    console = require('console'),
    fs = require('fs');

// require.paths.unshift(path.join(__dirname, '..'));

var bless = {
    version: [2, 2, 2],
    Parser: require('../bless/parser').Parser,
    cleanup: require('../bless/parser').cleanup
};

for (var k in bless) { exports[k] = bless[k] }
