"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

module.exports = parseCliArgs;
/* eslint no-process-exit: 0 */

var yargs = _interopRequire(require("yargs"));

var version = require("../package.json").version;

function parseCliArgs(argv) {
  if (argv !== process.argv) {
    argv = argv.split(" ");
    argv.unshift("", "");
  }

  var options = yargs.version("v" + version).usage("CSS Band Aid".magenta + " - Ensure CSS files meet IE 6-9 selector limit restrictions.\n\nUsage: $0 <input file> [<output file>] [options]").alias("version", "v").option("force", {
    alias: "f",
    demand: false,
    "default": false,
    describe: "modify the input file provided"
  }).epilogue("For additional information see https://github.com/css-band-aid/css-band-aid").wrap(null).parse(argv);

  options.input = options.length > 0 ? options._[0] : null;
  options.output = options.length > 1 ? options._[1] : null;

  if (!options.input) {
    throw "No input provided";
  }

  if (!options.force && !options.output) {
    throw "No output provided";
  }

  if (!options.force && options.input === options.output) {
    throw "Use --force of -f to modify the input file";
  }

  return options;
}

//import colors from 'colors';
//import formatNumberModule from 'format-number';
//import fs from 'fs';
//import path from 'path';
//import parser from '../lib/parser';
//import pjson from '../package.json';
//import pluralize from 'pluralize';
//import program from 'commander';

//const formatNumber = formatNumberModule();

//program.version(pjson.version)
//.usage('<input file> [<output file>] [options]')
//.option('-f, --force', 'modify the input file provided'.yellow)
//.parse(process.argv);

//let input = program.args[0];

//if (!input) {
//console.log('blessc: no input provided'.red);
//process.exit(1);
//}

//if (input !== '-' && !/\.css$/.test(input)) {
//console.log('blessc: input file is not a .css file'.red);
//process.exit(1);
//}

//let output = program.args[1];

//output = output || input;

//if (output === '-') {
//console.log('blessc: no output file provided'.red);
//process.exit(1);
//}

//if (output === input && !program.force) {
//console.log('blessc: use --force or -f to modify the input file'.red);
//process.exit(1);
//}

//fs.readFile(input, 'utf8', function(err, data) {
//let dirname, extension, fileData, filename, index, logSummary, newFilename, numFiles, numFilesWritten, numSelectors, result, _i, _len, _ref, _results;
//if (err) {
//throw err;
//}
//result = parser(data);
//numFiles = result.data.length;
//numSelectors = result.numSelectors;
//dirname = path.dirname(output);
//extension = path.extname(output);
//filename = path.basename(output, extension);
//numFilesWritten = 0;
//logSummary = function() {
//let message;
//message = [];
//message.push('Input file contained ' + (formatNumber(numSelectors)) + ' ' + (pluralize('selector', numSelectors)) + '.');
//if (numFiles > 1) {
//message.push('' + (formatNumber(numFiles)) + ' ' + (pluralize('file', numFiles)) + ' created.');
//} else {
//message.push('No changes made.');
//}
//return console.log(message.join(' ').green.bold);
//};
//if (numFiles > 1) {
//_ref = result.data;
//_results = [];
//for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
//fileData = _ref[index];
//newFilename = '' + (path.join(dirname, filename)) + '-blessed' + (index + 1) + extension;
//_results.push(fs.writeFile(newFilename, fileData, function(err) {
//if (err) {
//throw err;
//}
//console.log(('Created ' + newFilename).yellow);
//numFilesWritten++;
//if (numFilesWritten === numFiles) {
//return logSummary();
//}
//}));
//}
//return _results;
//} else {
//return logSummary();
//}
//});