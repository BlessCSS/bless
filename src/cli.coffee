bless = '../lib/bless'
colors = require 'colors'
fs = require 'fs'
path = require 'path'
pjson = require '../package.json'
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


# Helper functions
#
pluralize = (noun, number) ->
  noun = "#{noun}s" if number isnt 1
  return noun

formatNumber = (nStr) ->
  nStr += ""
  x = nStr.split(".")
  x1 = x[0]
  x2 = (if x.length > 1 then "." + x[1] else "")
  rgx = /(\d+)(\d{3})/
  x1 = x1.replace(rgx, "$1" + "," + "$2")  while rgx.test(x1)
  x1 + x2


# For now, assume that the input is not stdin.
#
fs.readFile input, 'utf8', (err, data) ->
  throw err if err

  info = bless data
  numFiles = info.data.length
  {numSelectors} = info

  dirname = path.dirname output
  extension = path.extname output
  filename = path.basename output, extension

  if numFiles > 1
    for fileData, index in info.data
      newFilename = "#{path.join(dirname, filename)}-blessed#{index + 1}#{extension}"

      fs.writeFile newFilename, fileData, (err) ->
        throw err if err
        # console.log "Created #{newFilename}".yellow


  message = []

  message.push "Input file contained #{formatNumber(numSelectors)} #{pluralize('selector', numSelectors)}."

  if numFiles > 1
    message.push "#{formatNumber(numFiles)} #{pluralize('file', numFiles)} created."
  else
    message.push 'No changes made.'


  console.log  message.join(' ').green.bold
