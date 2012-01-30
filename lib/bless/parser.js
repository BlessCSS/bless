#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    bless = exports;

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
                blocks = str.match(/([^\{]+\{(?:[^\{\}]|\{[^\{\}]*\})*\})/g),
                numSelectors = 0;
            if(!selectors) {
                files.push({
                    filename: output,
                    content: str
                });
                callback(error, files, numSelectors);
                return;
            }
            
            numSelectors = selectors.length;
            
            var numFiles = Math.ceil(selectors.length / limit),
                ext = path.extname(output),
                filename = path.basename(output, ext),
                fileIndex = numFiles - 1,
                fileContents = [];
            
            while (blocks.join('').match(/(,|\{)/g).length > limit) {
                fileContents.push(blocks.shift());
            }
            
            fileContents = blocks;
            
            if (numFiles > 1) {
                for(var i=1; i<numFiles; i++) {
                    var import = '@import url(\'' + filename + '-blessed' + i + ext + '\');';
                    import = options.compress ? import : import + '\n';
                    fileContents.unshift(import);
                }
            }

            files.push({
                filename: output,
                content: fileContents.join('')
            });

            callback(error, files, numSelectors);
        }
    }
}

//
// Remove previously generated CSS files which are no longer needed
//
bless.Parser.cleanup = function (output, callback) {
    var error = null,
        dir = path.dirname(output),
        ext = path.extname(output),
        filename = path.basename(output, ext),
        fileRegex = filename + '-blessed' + '(\\d+)' + ext,
        importRegex = '@import url\\(\'(' + fileRegex + '\')\\);';

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