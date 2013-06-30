#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    bless = exports,
    cacheBuster = '?z=' + new Date().getTime();

bless.Parser = function Parser(env) {
    this.env = env = env || {};
    var output = this.env.output,
        options = this.env.options;

    //
    // The Parser
    //
    return parser = {
        //
        // Parse an input string,
        // call `callback` when done.
        //
        parse: function (str, callback) {
            var files = [],
                error = null,
                limit = 4095,
                selectors = str.match(/(,|\{)/g),
                rules = str.match(/([^\{]+\{(?:[^\{\}]|\{[^\{\}]*\})*\})/g),
                numSelectors = 0;

            if(! selectors) {
                files.push({
                    filename: output,
                    content: str
                });
                callback(error, files, numSelectors);
                return;
            }

            var ext = path.extname(output),
                filename = path.basename(output, ext),
                offset = 0,
                selectorCount = 0;

            for (var i = 0, length = rules.length; i < length; i++) {
                var matchCount,
                    matchArray = [],
                    regex = /(?:\s*@media\s*[^\{]*(\{))?(?:\s*(?:[^,\{]*(?:(,)|(\{)(?:[^\}]*\}))))/g,
                    rule = rules[i];

                do {
                    var no_comments = rule.replace(/(\/\*[^*]*\*+([^/*][^*]*\*+)*\/)/g, '');
                    var matches = regex.exec(no_comments);

                    if (matches) {
                        for (m=1, matchesLength=matches.length; m<matchesLength; m++) {
                            var match = matches[m];
                            if(match) {
                                matchArray.push(match);
                            }
                        }
                    }
                } while(matches);

                matchCount = matchArray.length;

                if (selectorCount + matchCount > limit) {
                    var slice = rules.slice(offset, i);

                    if (slice.length > 0) {
                        slice[0] = slice[0].replace(/^\s+/, '');

                        files.push({
                            content: slice.join('')
                        });
                    }

                    offset = i;
                    selectorCount = 0;
                }

                numSelectors += matchCount;
                selectorCount += matchCount;
            }

            rules = rules.slice(offset);

            var filesLength = files.length;

            for(var j=0; j<filesLength; j++) {
                files[j]['filename'] = output.replace(ext, '-blessed' + (filesLength - j) + ext);
            }

            if (filesLength > 0 && options.imports) {
                for(var k=1; k<=filesLength; k++) {
                    var outputFilename = filename + '-blessed' + k + ext;
                    if (options.cacheBuster) {
                        outputFilename += cacheBuster;
                    }
                    var importStr = '@import url(\'' + outputFilename + '\');';
                    importStr = options.compress ? importStr : importStr + '\n';
                    rules.unshift(importStr);
                }
            }

            files.push({
                filename: output,
                content: rules.join('')
            });

            callback(error, files, numSelectors);
        }
    }
}

//
// Remove previously generated CSS files which are no longer needed
//
bless.Parser.cleanup = function (options, output, callback) {
    var error = null,
        dir = path.dirname(output),
        ext = path.extname(output),
        filename = path.basename(output, ext),
        fileRegex = filename + '-blessed' + '(\\d+)' + ext;

    if (options.cacheBuster) {
        fileRegex += cacheBuster;
    }

    var importRegex = '@import url\\(\'(' + fileRegex + '\')\\);';

    fs.readFile(output, 'utf8', function (err, data) {
        if (err) {
            callback(err);
        }

        var importsMatch = data.match(importRegex),
            importIndex = 0;
        if (importsMatch) {
            importIndex = importsMatch[2];
        }

        fs.readdir(dir, function (err, filenames) {
            if (err) {
                callback(err);
            }

            var files = [];

            for (i in filenames) {
                var file = filenames[i],
                    match = file.match(fileRegex);
                if (match) {
                    if (parseInt(match[1], 10) > importIndex) {
                        files.push(path.join(dir, file));
                    }
                }
            }

            callback(err, files);
        });
    });
};
