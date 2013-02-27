/*
 * Provides bless.js as Grunt task
 *
 * Copyright (c) Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path'),
      bless = require('../lib/bless');

    grunt.registerMultiTask('bless', 'Split CSS files suiteable for IE', function() {

        var options = this.options({
          cacheBuster: true,
          cleanup: true,
          compress: false,
          force: false,
          imports: true
        });
        grunt.log.writeflags(options, 'options');

        grunt.util.async.forEach(this.files, function (files, next) {
            var data = '';

            // read and concat files
            files.src.forEach(function (file) {
                data += grunt.file.read(file);
            });

            new (bless.Parser)({
                output: files.dest,
                options: options
            }).parse(data, function (err, files, numSelectors) {
                if (err) {
                    grunt.log.error(err);
                    throw grunt.util.error(err);
                }

                // print log message
                var msg = 'Found ' + numSelectors + ' selector';
                if (numSelectors !== 1) {
                    msg += 's';
                }
                msg += ', ';
                if (files.length > 1) {
                    msg += 'splitting into ' + files.length + ' files.';
                } else {
                    msg += 'not splitting.';
                }
                grunt.log.verbose.writeln(msg);

                // write processed file(s)
                files.forEach(function (file) {
                    grunt.file.write(file.filename, file.content);
                });
            });
            next();
        });
    });
};
