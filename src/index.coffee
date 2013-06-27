{print} = require 'util'
colors = require 'colors'
css = require 'css'
fs = require 'fs'
program = require 'commander'
pjson = require "#{__dirname}/../package.json"

bless = ->

  SELECTOR_LIMIT = 4095


  # Command line arguments.
  #
  program
    .version(pjson.version)
    .usage('<input file> [<output file>] [options]')
    .option('-f, --force', 'modify the input file provided'.yellow)
    .parse(process.argv)



  # Helper function for creating new ASTs.
  #
  newAst = (rules) ->
    type: 'stylesheet'
    stylesheet:
      rules: rules



  # Input is the first argument passed to the binary after options flags have
  # been stripped.
  #
  input = program.args[0]

  unless input
    console.log 'blessc: no input provided'.red
    process.exit(1)


  # If input is not to be read from stdin, perform a simple check to see if
  # that the file has a .css extension.
  #
  if input is not '-' and /\.css/.test input
    console.log 'blessc: input file is not a .css file'.red
    process.exit(1)



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
    process.exit(1)

  # Exit if output is equal to input and the "force" flag was not used, to
  # prevent unintentional modifications to the source file.
  #
  if output is input and not program.force
    console.log 'blessc: use --force or -f to modify the input file'.red
    process.exit(1)



  # For now, assume that the input is not stdin.
  #
  fs.readFile input, 'utf8', (err, data) ->
    throw err if err

    # Convert the CSS into an abstract syntax tree.
    #
    ast = css.parse data

    # Keep track of the number of selectors as the tree is traversed in order
    # to identify when the selector limit has been reached.
    #
    numSelectors = 0

    # The rules which have been traversed. Used to easily produce a new AST
    # using previously traversed nodes.
    #
    rulesCache = []

    # ASTs which represent the stylesheets which should be created as a result
    # of processing.
    #
    newAsts = []


    # Increment the selector count and push rules to the cache.
    #
    for rule in ast.stylesheet.rules
      switch rule.type
        when 'rule'
          numSelectors += rule.selectors.length
        else
          # Nested rules maybe be media queries, for example.
          #
          for nestedRule in rule.rules
            numSelectors += nestedRule.selectors.length

      rulesCache.push rule


      # Produce a new AST every time the selector limit is reached and reset
      # the rules cache.
      #
      if numSelectors > 4095
        newAsts.push newAst(rulesCache)
        rulesCache = []


    # If no new ASTs were created, the selector limit was never reached so use
    # the original ruleset.
    #
    newAsts.push newAst(ast.stylesheet.rules) unless newAsts.length
    console.log newAsts


    # console.log JSON.stringify(ast, null, 2)

    # string = css.stringify obj
    # console.log string

module.exports = bless
