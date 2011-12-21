var path = require('path'),
    sys = require('sys'),
    fs = require('fs');

require(path.join(__dirname, '../bless'));

var bless = {
    version: [2, 0, 2],
    Parser: require('../bless/parser').Parser,
    cleanup: require('../bless/parser').cleanup
};

for (var k in bless) { exports[k] = bless[k] }