/*
 * Sample Gruntfile.js for using bless in Grunt
 *
 * Copyright (c) 2013 Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: 'tmp'
    },

    // Configuration to be run (and then tested).
    bless: {
      split: {
        files: {
          'tmp/above-limit.css': ['test/input/above-limit.css'],
          'tmp/below-limit.css': ['test/input/below-limit.css']
        }
      }
    },
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('mkdir', grunt.file.mkdir);

  grunt.registerTask('default', ['jshint', 'mkdir:tmp', 'bless']);
};