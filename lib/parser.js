"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chunks = regeneratorRuntime.mark(function chunks(data) {
  var ast, rules, splitRules, selectorCount, i, rule, ruleSelectorCount;
  return regeneratorRuntime.wrap(function chunks$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        ast = css.parse(data);
        rules = ast.stylesheet.rules;
        splitRules = [];
        selectorCount = 0;
        i = 0;

      case 5:
        if (!(i < rules.length)) {
          context$1$0.next = 18;
          break;
        }

        rule = rules[i];
        ruleSelectorCount = calculateSelectorLength(rule);

        if (!(selectorCount + ruleSelectorCount > SELECTOR_LIMIT)) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.next = 11;
        return createAst(splitRules, selectorCount);

      case 11:
        selectorCount = 0;
        splitRules = [];

      case 13:

        selectorCount += ruleSelectorCount;
        splitRules.push(rule);

      case 15:
        i++;
        context$1$0.next = 5;
        break;

      case 18:
        context$1$0.next = 20;
        return createAst(splitRules);

      case 20:
      case "end":
        return context$1$0.stop();
    }
  }, chunks, this);
});
module.exports = parse;

var css = _interopRequire(require("css"));

var SELECTOR_LIMIT = 4095;

function createAst(rules, selectorCount) {
  return {
    ast: {
      type: "stylesheet",
      stylesheet: {
        rules: rules
      }
    },
    selectorCount: selectorCount
  };
}

function calculateSelectorLength(rule) {
  switch (rule.type) {
    case "rule":
      return rule.selectors.length;
    case "comment":
      return 0;
    default:
      return rule.rules.reduce(function (acc, rule) {
        return acc + rule.selectors.length;
      }, 0);
  }
}

function parse(data) {
  //let ast = css.parse(data);

  //let intermediateAsts = ast.stylesheet.rules.reduce((acc, rule) => {
  //let current = acc[acc.length-1];
  //let ruleSelectorCount = calculateSelectorLength(rule);

  //if (current.selectorCount + ruleSelectorCount > SELECTOR_LIMIT) {
  //current = createIntermediateAst();
  //acc.push(current);
  //}

  //current.ast.stylesheet.rules.push(rule);
  //current.selectorCount += ruleSelectorCount;

  //return acc;
  //}, [createIntermediateAst()]);

  //let newData = intermediateAsts.map(({ast}) => {
  //return css.stringify(ast);
  //});

  var totalSelectorCount = 0;
  var newData = [];
  //let blocks = chunks(data);

  for (var block in chunks(data)) {
    console.log("block");
    console.log(block);
    console.log(typeof block);
    var ast = block.ast;
    var selectorCount = block.selectorCount;

    console.log("ast");
    console.log(ast);
    console.log("selectorCount");
    console.log(selectorCount);
    totalSelectorCount += selectorCount;
    newData.push(css.stringify(ast));
  }

  return {
    data: newData,
    totalSelectorCount: totalSelectorCount
  };
}