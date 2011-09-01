var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require.paths.unshift(path.join(__dirname, '..', 'lib'));

var bless = require('bless');

function assertContent(file) {
    return function (e, files) {
        files = files.reverse();
        for (var i = 0; i < files.length; i++) {
            var index = i > 0 ? i + 1 : '';
            file = path.basename(file, path.extname(file));
            assert.equal (files[i]['content'], fs.readFileSync(path.join('test/output', file + index + '.css'), 'utf-8'));
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
                compress: false
            }
        }).parse(fs.readFileSync(path.join('test/input', file), 'utf-8'), callback);
    }
};

var input = [];

fs.readdirSync('test/input').forEach(function (file) {
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