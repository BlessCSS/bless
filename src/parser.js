(function() {
  var SELECTOR_LIMIT, createAst, css, parser;

  css = require('css');

  SELECTOR_LIMIT = 4095;

  createAst = function(rules) {
    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rules
      }
    };
  };

  parser = function(data) {
    var ast, i, j, len, len1, nestedRule, newAsts, newData, numNestedRuleSelectors, numSelectors, ref, ref1, rule, startNewAst, totalNumSelectors, traversedRules;
    ast = css.parse(data);
    numSelectors = 0;
    totalNumSelectors = 0;
    traversedRules = [];
    newAsts = [];
    startNewAst = function() {
      newAsts.push(createAst(traversedRules));
      traversedRules = [];
      return numSelectors = 0;
    };
    ref = ast.stylesheet.rules;
    for (i = 0, len = ref.length; i < len; i++) {
      rule = ref[i];
      switch (rule.type) {
        case 'rule':
          if (numSelectors + rule.selectors.length > SELECTOR_LIMIT) {
            startNewAst();
          }
          numSelectors += rule.selectors.length;
          totalNumSelectors += rule.selectors.length;
          break;
        case 'comment':
          break;
        default:
          numNestedRuleSelectors = 0;
          if (rule.rules) {
            ref1 = rule.rules;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              nestedRule = ref1[j];
              if (nestedRule && nestedRule.selectors) {
                numNestedRuleSelectors += nestedRule.selectors.length;
              }
            }
          }
          if (numSelectors + numNestedRuleSelectors > SELECTOR_LIMIT) {
            startNewAst();
          }
          numSelectors += numNestedRuleSelectors;
          totalNumSelectors += numNestedRuleSelectors;
      }
      traversedRules.push(rule);
      if (numSelectors === SELECTOR_LIMIT) {
        startNewAst();
      }
    }
    if (traversedRules.length) {
      newAsts.push(createAst(traversedRules));
    }
    newData = (function() {
      var k, len2, results;
      results = [];
      for (k = 0, len2 = newAsts.length; k < len2; k++) {
        ast = newAsts[k];
        results.push(css.stringify(ast));
      }
      return results;
    })();
    return {
      data: newData,
      numSelectors: totalNumSelectors
    };
  };

  module.exports = parser;

}).call(this);
