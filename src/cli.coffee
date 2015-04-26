colors = require "colors"

fs = require "fs"
path = require "path"
pjson = require "../package.json"
program = require "commander"

importer = require "../lib/importer"
parser = require "../lib/parser"
reporter = require "../lib/reporter"


program
  .version(pjson.version)
  .usage("<input file> [<output file>] [options]")
  .option("-f, --force", "modify the input file provided".yellow)
  .option("-s, --suffix", "applied to files that are imported. defaults to -blessed".yellow)
  .parse process.argv


# Input is the first argument passed to the binary after options flags have
# been stripped.
#
input = program.args[0]

unless input
  console.log "blessc: no input provided".red
  process.exit 1

# If input is not to be read from stdin, perform a simple check to see if
# that the file has a .css extension.
#
if input isnt "-" and not /\.css$/.test(input)
  console.log "blessc: input file is not a .css file".red
  process.exit 1


# Output is the second (optional) argument passed to the binary after options
# flags have been stripped.
#
output = program.args[1]

# If output was not provided, use the input parameter
#
output ?= input

# Exit if output was not provided and the input is to be read from stdin.
#
if output is "-"
  console.log "blessc: no output file provided".red
  process.exit 1

# Exit if output is equal to input and the "force" flag was not used, to
# prevent unintentional modifications to the source file.
#
if output is input and not program.force
  console.log "blessc: use --force or -f to modify the input file".red
  process.exit 1


# Set the suffix for imported files.
#
suffix = program.suffix

# Use a default suffix is one isn"t provided.
#
suffix ?= "blessed"


# For now, assume that the input is not stdin.
#
fs.readFile input, "utf8", (err, data) ->
  throw err if err

  result = parser data
  numFiles = result.data.length
  {numSelectors} = result

  dirname = path.dirname output
  extension = path.extname output
  filename = path.basename output, extension

  numFilesWritten = 0

  printReport = ->
    report = reporter
      numSelectors: numSelectors
      numFiles: numFiles

    console.log report.green.bold


  if numFiles <= 1
    printReport()
  else
    for fileData, index in result.data
      if index is 0
        importStatements = importer
          numFiles: result.data.length
          output: output
          suffix: suffix

        fileData = """
          #{importStatements}\n
          #{fileData}
        """

        indexedSuffix = ""
      else
        indexedSuffix = "-#{suffix}-#{index}"

      newFilename = "#{path.join(dirname, filename)}#{indexedSuffix}#{extension}"

      do (newFilename) ->
        fs.writeFile newFilename, "#{fileData}\n", (err) ->
          throw err if err
          numFilesWritten++
          printReport() if numFilesWritten is numFiles
