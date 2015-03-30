"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/* eslint no-process-exit: 0 */

var colors = _interopRequire(require("colors"));

var formatNumberModule = _interopRequire(require("format-number"));

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var parser = _interopRequire(require("../lib/parser"));

var pjson = _interopRequire(require("../package.json"));

var pluralize = _interopRequire(require("pluralize"));

var program = _interopRequire(require("commander"));

var formatNumber = formatNumberModule();

program.version(pjson.version).usage("<input file> [<output file>] [options]").option("-f, --force", "modify the input file provided".yellow).parse(process.argv);

var input = program.args[0];

if (!input) {
  console.log("blessc: no input provided".red);
  process.exit(1);
}

if (input !== "-" && !/\.css$/.test(input)) {
  console.log("blessc: input file is not a .css file".red);
  process.exit(1);
}

var output = program.args[1];

output = output || input;

if (output === "-") {
  console.log("blessc: no output file provided".red);
  process.exit(1);
}

if (output === input && !program.force) {
  console.log("blessc: use --force or -f to modify the input file".red);
  process.exit(1);
}

fs.readFile(input, "utf8", function (err, data) {
  var dirname = undefined,
      extension = undefined,
      fileData = undefined,
      filename = undefined,
      index = undefined,
      logSummary = undefined,
      newFilename = undefined,
      numFiles = undefined,
      numFilesWritten = undefined,
      numSelectors = undefined,
      result = undefined,
      _i = undefined,
      _len = undefined,
      _ref = undefined,
      _results = undefined;
  if (err) {
    throw err;
  }
  result = parser(data);
  numFiles = result.data.length;
  numSelectors = result.numSelectors;
  dirname = path.dirname(output);
  extension = path.extname(output);
  filename = path.basename(output, extension);
  numFilesWritten = 0;
  logSummary = function () {
    var message = undefined;
    message = [];
    message.push("Input file contained " + formatNumber(numSelectors) + " " + pluralize("selector", numSelectors) + ".");
    if (numFiles > 1) {
      message.push("" + formatNumber(numFiles) + " " + pluralize("file", numFiles) + " created.");
    } else {
      message.push("No changes made.");
    }
    return console.log(message.join(" ").green.bold);
  };
  if (numFiles > 1) {
    _ref = result.data;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      fileData = _ref[index];
      newFilename = "" + path.join(dirname, filename) + "-blessed" + (index + 1) + extension;
      _results.push(fs.writeFile(newFilename, fileData, function (err) {
        if (err) {
          throw err;
        }
        console.log(("Created " + newFilename).yellow);
        numFilesWritten++;
        if (numFilesWritten === numFiles) {
          return logSummary();
        }
      }));
    }
    return _results;
  } else {
    return logSummary();
  }
});