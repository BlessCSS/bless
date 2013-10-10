css = require 'css'


SELECTOR_LIMIT = 4095

# Helper function for creating new ASTs.
#
newAst = (rules) ->
  type: 'stylesheet'
  stylesheet:
    rules: rules


bless = (data) ->

  # Convert the CSS into an abstract syntax tree.
  #
  ast = css.parse data

  # Keep track of the number of selectors as the tree is traversed in order
  # to identify when the selector limit has been reached.
  #
  numSelectors = 0

  # Also keep track of the total number of selectors for reporting purposes.
  #
  totalNumSelectors = 0

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
        totalNumSelectors += rule.selectors.length
      else
        # Nested rules. Media queries, for example.
        #
        for nestedRule in rule.rules
          numSelectors += nestedRule.selectors.length
          totalNumSelectors += nestedRule.selectors.length

    rulesCache.push rule


    # Produce a new AST every time the selector limit is reached and reset
    # the rules cache.
    #
    if numSelectors is SELECTOR_LIMIT
      newAsts.push newAst(rulesCache)
      rulesCache = []
      numSelectors = 0


  # Convert any remaining rules to a new AST. This also accounts for the case
  # where the selector limit was not reached.
  #
  newAsts.push newAst(rulesCache) if rulesCache.length

  newData = (css.stringify ast for ast in newAsts)

  return {
    data: newData
    numSelectors: totalNumSelectors
  }

module.exports = bless
