bless = require '../lib/bless'
{expect} = require 'chai'
fs = require 'fs'
path = require 'path'


inputFixturesDir = path.join __dirname, 'fixtures', 'input'
outputFixturesDir = path.join __dirname, 'fixtures', 'output', 'parser'


# Helper function for adding contexts to the spec.
#
addContext = (fixtureName, test) ->

  # Set a default test case if one isn't provided.
  #
  test ?= (result) ->

    # Compare each array item to it's relevant output fixture file.
    #
    for parserData, index in result.data

      # Read data from an output fixture.
      #
      outputFilename = "#{index}.css"
      outputFilepath = path.join outputFixturesDir, fixtureName, outputFilename
      outputData = fs.readFileSync outputFilepath, { encoding: 'utf8' }

      # Remove whitespace from both data sets.
      #
      parserData = parserData.replace(/\s+/g, '');
      outputData = outputData.replace(/\s+/g, '');

      expect(parserData).to.equal outputData


  # Build up a context from input fixture files.
  #
  inputFilename = "#{fixtureName}.css"
  context = "with data from the fixture \"#{inputFilename}\""

  spec.Parser[context] = {}

  inputFilepath = path.join inputFixturesDir, inputFilename
  inputData = fs.readFileSync inputFilepath, { encoding: 'utf8' }
  result = bless inputData


  # Add the predicate and test case to the context.
  #
  spec.Parser[context]['should parse the CSS correctly'] = ->
    test result


# Start a new spec.
#
spec =
  Parser: {}


# Add a new context for each input fixture file.
#
inputFiles = fs.readdirSync inputFixturesDir

for inputFilename in inputFiles
  continue unless /\.css$/.test inputFilename
  inputFileExtension = path.extname inputFilename
  inputFile = path.basename inputFilename, inputFileExtension
  addContext inputFile


# Export the spec to the test runner.
#
module.exports = spec
