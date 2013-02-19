var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    bless = require('../lib/bless');

function assertContent(file) {
    return function (e, files) {
        files = files.reverse();
        for (var i = 0; i < files.length; i++) {
            file = path.basename(file, path.extname(file));
            var blessed = i > 0 ? '-blessed' + i : '';
            assert.equal (files[i]['content'], fs.readFileSync(path.join(__dirname, 'output', file + blessed + '.css'), 'utf-8'));
        }
    };
}

function checkFile(file) {
    var context = {
        topic: function () {
            var method = this.context.name;
            parser[method](file, this.callback);
        }
    };

    context[file] = assertContent(file);

    return context;
}

var parser = {
    parse: function (file, callback) {
        new(bless.Parser)({
            output: file,
            options: {
                cleanup: true,
                compress: false,
                imports: true
            }
        }).parse(fs.readFileSync(path.join(__dirname, 'input', file), 'utf-8'), callback);
    }
};

var input = [];

fs.readdirSync(path.join(__dirname, 'input')).forEach(function (file) {
    if (! /\.css/.test(file)) { return }
    input.push(file);
});

var Parser = vows.describe('Parser');

for (i in input) {
    Parser.addBatch({
        'parse': checkFile(input[i])
    });
}

Parser.export(module);