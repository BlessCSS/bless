colors = require 'colors'
formatNumber = require('format-number')()
fs = require 'fs'
path = require 'path'
{parser} = require '../lib/bless'
pjson = require '../package.json'
pluralize = require 'pluralize'
program = require 'commander'


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

  result = parser data
  numFiles = result.data.length
  {numSelectors} = result

  dirname = path.dirname output
  extension = path.extname output
  filename = path.basename output, extension

  numFilesWritten = 0

  logSummary = ->
    message = []

    message.push "Input file contained #{formatNumber(numSelectors)} #{pluralize('selector', numSelectors)}."

    if numFiles > 1
      message.push "#{formatNumber(numFiles)} #{pluralize('file', numFiles)} created."
    else
      message.push 'No changes made.'

    console.log  message.join(' ').green.bold


  if numFiles > 1
    for fileData, index in result.data
      newFilename = "#{path.join(dirname, filename)}-blessed#{index + 1}#{extension}"

      fs.writeFile newFilename, fileData, (err) ->
        throw err if err
        console.log "Created #{newFilename}".yellow
        numFilesWritten++
        logSummary() if numFilesWritten is numFiles
  else
    logSummary()
