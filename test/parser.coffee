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
      outputFixtureFilename = "#{index}.css"
      outputFixtureFilepath = path.join outputFixturesDir, fixtureName, outputFixtureFilename
      outputFixtureData = fs.readFileSync outputFixtureFilepath, { encoding: 'utf8' }

      # Remove whitespace from both data sets.
      #
      parserData = parserData.replace(/\s+/g, '');
      outputFixtureData = outputFixtureData.replace(/\s+/g, '');

      expect(parserData).to.equal outputFixtureData


  # Build up a context from input fixture files.
  #
  inputFixtureFilename = "#{fixtureName}.css"
  context = "with data from the fixture \"#{inputFixtureFilename}\""

  spec.Parser[context] = {}

  inputFixtureFilepath = path.join inputFixturesDir, inputFixtureFilename
  inputFixtureData = fs.readFileSync inputFixtureFilepath, { encoding: 'utf8' }
  result = bless inputFixtureData


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
inputFixtureFiles = fs.readdirSync inputFixturesDir

for filename in inputFixtureFiles
  continue unless /\.css$/.test filename
  fileExtension = path.extname filename
  fixtureName = path.basename filename, fileExtension
  addContext fixtureName


# Export the spec to the test runner.
#
module.exports = spec
