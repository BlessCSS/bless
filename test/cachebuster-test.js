var assert = require('assert'),
    fs = require('fs'),
    glob = require('glob'),
    bless = require('../lib/bless'),
    options = {
        imports: true,
        cacheBuster: 'hash'
    },
    imports = {
        'test/input/above-limit.css': "@import url('above-limit-blessed2.css?z=6f9aa9cd206f0e64e49f65da8349015a');\n@import url('above-limit-blessed1.css?z=baa7e07769e537b0ba80c80ada8afd8f');",
        'test/input/above-limit-with-comment.css': "@import url('above-limit-with-comment-blessed1.css?z=80420ee8477f060052cda65442358706');"
    };

describe('CacheBuster', function() {
    glob.sync('test/input/above*.css').forEach(function(file){
        it ("should parse "+file, function(done) {
            var input = fs.readFileSync(file, 'utf-8'),
                outputFile = file.replace('/input/', '/output/'),
                parser = bless.Parser({output: outputFile, options: options});

            parser.parse(input, function(error, files, numSelectors){
                var blessedImports = files.reverse()[0].content;
                assert.ok(blessedImports.indexOf(imports[file]) === 0);
                done();
            });
        });
    });
});
