colors = require 'colors'
fs = require 'fs'
path = require 'path'
pjson = require path.join(__dirname, '..', 'package.json')
program = require 'commander'

bless = require path.join(__dirname, '..', 'lib', 'bless')


program
  .version(pjson.version)
  .usage('<input file> [<output file>] [options]')
  .option('-f, --force', 'modify the input file provided'.yellow)
  .parse process.argv


# Input is the first argument passed to the binary after options flags have
# been stripped.
#
input = program.args[0]

unless input
  console.log 'blessc: no input provided'.red
  process.exit 1

# If input is not to be read from stdin, perform a simple check to see if
# that the file has a .css extension.
#
if input isnt '-' and not /\.css$/.test(input)
  console.log 'blessc: input file is not a .css file'.red
  process.exit 1


# Output is the second (optional) argument passed to the binary after options
# flags have been stripped.
#
output = program.args[1]

# If output was not provided, use the input parameter
#
output = output or input

# Exit if output was not provided and the input is to be read from stdin.
#
if output is '-'
  console.log 'blessc: no output file provided'.red
  process.exit 1

# Exit if output is equal to input and the 'force' flag was not used, to
# prevent unintentional modifications to the source file.
#
if output is input and not program.force
  console.log 'blessc: use --force or -f to modify the input file'.red
  process.exit 1


# For now, assume that the input is not stdin.
#
fs.readFile input, 'utf8', (err, data) ->
  throw err if err
  filesData = bless data
