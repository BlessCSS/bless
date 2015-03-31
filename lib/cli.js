"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/* eslint no-process-exit: 0 */

require("colors");

var yargs = _interopRequire(require("yargs"));

var parseCliArgs = _interopRequire(require("./parse-cli-args"));

var options = undefined;

try {
  options = parseCliArgs(process.argv);
  console.log(options);
} catch (err) {
  console.log(("Failed: " + err.toString()).red);
  console.log(yargs.help());
  process.exit(1);
}