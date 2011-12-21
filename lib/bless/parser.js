#!/usr/bin/env node

var path = require('path'),
    fs = require('fs');

var bless = exports;

bless.Parser = function Parser(env) {
    this.env = env = env || {};
    var output = this.env.output;
    var options = this.env.options;
    
    //
    // The Parser
    //
    return parser = {
        //
        // Parse an input string,
        // call `callback` when done.
        //
        parse: function (str, callback) {
            var files = [];
            var error = null;
            var limit = 4095;
            var selectors = str.match(/[^,\{\}]*(,|\{[^\{\}]*\}\s*)/g);
            var numSelectors = 0;
            
            if(!selectors) {
                files.push({
                    filename: output,
                    content: str
                });
                callback(error, files, numSelectors);
                return;
            }
            
            numSelectors = selectors.length;
            
            var numFiles = Math.ceil(selectors.length / limit);
            
            var ext = path.extname(output);
            var filename = path.basename(output, ext);
            
            var fileIndex = numFiles - 1;
            var fileContents;
            
            while (selectors.length > limit) {
                var newFilename = output.replace(ext, '-blessed' + fileIndex + ext);
                fileContents = selectors.splice(0, limit);
                
                while (!fileContents[fileContents.length - 1].match(/[^,\{\}]*(\{[^\{\}]*\}\s*)/g)) {
                    selectors.unshift(fileContents.pop());
                }
                
                var lastIndex = fileContents.length - 1;
                fileContents[lastIndex] = fileContents[lastIndex].replace(/\s+$/g, '');
                
                files.push({
                    filename: newFilename,
                    content: fileContents.join('')
                });

                fileIndex--;
            }
            
            fileContents = selectors;
            
            if (numFiles > 1) {
                fileContents.unshift('\n');

                for(var i=1; i<numFiles; i++)
                {
                    var importRule = '@import url(\'' + filename + '-blessed' + i + ext + '\');';
                    importRule = options.compress ? importRule : importRule + '\n';
                    fileContents.unshift(importRule);
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
    var error = null;
    
    var dir = path.dirname(output);
    var ext = path.extname(output);
    var filename = path.basename(output, ext);
    
    var fileRegex = filename + '-blessed' + '(\\d+)' + ext;
    var importRegex = '@import url\\(\'(' + fileRegex + '\')\\);';

    fs.readFile(output, 'utf8', function (err, data) {
        if (err) {
            callback(err);
        }
        
        var importsMatch = data.match(importRegex);
        
        var importIndex = 0;
        if (importsMatch) {
            importIndex = importsMatch[2];
        }

        fs.readdir(dir, function (err, filenames) {
            if (err) {
                callback(err);
            }
            
            var files = [];
            
            for (i in filenames) {
                var file = filenames[i];
                var match = file.match(fileRegex);
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