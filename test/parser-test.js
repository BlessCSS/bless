var assert = require('assert'),
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    bless = require('../lib/bless'),
    options = {
        cleanup: true,
        compress: false,
        imports: true
    };

describe('Parser', function() {
    glob.sync('test/input/*.css').forEach(function(file){
        it ("should parse "+file, function(done) {
            var input = fs.readFileSync(file, 'utf-8'),
                outputFile = file.replace('/input/', '/output/'),
                parser = bless.Parser({output: outputFile, options: options});

            parser.parse(input, function(error, files, numSelectors){
                // The number of files should always be at least one, and should
                // be proportional to the number of selectors.
                assert.equal(files.length, Math.max(1, Math.ceil(numSelectors/4095)));
                // Each file on the filesystem should contain the expected content.
                files.forEach(function(file){
                    assert.equal(file.content, fs.readFileSync(file.filename, 'UTF-8'));
                });
                done();
            });
        });
    });
});
