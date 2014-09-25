css = require 'css'


SELECTOR_LIMIT = 4095

# Helper function for creating new ASTs.
#
createAst = (rules) ->
  type: 'stylesheet'
  stylesheet:
    rules: rules


parser = (data) ->

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
  traversedRules = []

  # ASTs which represent the stylesheets which should be created as a result
  # of processing.
  #
  newAsts = []


  # Helper function for a pushing a new AST and clearing traversed rules.
  #
  startNewAst = ->
    newAsts.push createAst(traversedRules)
    traversedRules = []
    numSelectors = 0


  # Increment the selector count and track traversed rules.
  #
  for rule in ast.stylesheet.rules
    switch rule.type

      # Regular CSS rules.
      #
      when 'rule'
        # Check if adding this rule will break the selector limit. If so,
        # produce a new AST first.
        #
        startNewAst() if numSelectors + rule.selectors.length > SELECTOR_LIMIT


        numSelectors += rule.selectors.length
        totalNumSelectors += rule.selectors.length


      # No-ops.
      #
      when 'comment' then
      when 'font-face' then
      when 'keyframes' then
      when 'imports' then

      # Nested rules. Media queries, for example.
      #
      else
        # Check if adding this rule will break the selector limit. If so,
        # produce a new AST first.
        #
        numNestedRuleSelectors = 0

        for nestedRule in rule.rules
          numNestedRuleSelectors += nestedRule.selectors.length

        startNewAst() if numSelectors + numNestedRuleSelectors > SELECTOR_LIMIT


        numSelectors += numNestedRuleSelectors
        totalNumSelectors += numNestedRuleSelectors

    traversedRules.push rule


    # Produce a new AST every time the selector limit is reached and clear
    # traversed rules.
    #
    startNewAst() if numSelectors is SELECTOR_LIMIT


  # Convert any remaining rules to a new AST. This also accounts for the case
  # where the selector limit was not reached.
  #
  newAsts.push createAst(traversedRules) if traversedRules.length

  newData = (css.stringify ast for ast in newAsts)

  return {
    data: newData
    numSelectors: totalNumSelectors
  }

module.exports = {parser}
