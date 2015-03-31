// CLI Runner will work with pre-transpiled babel output, thus needing this
// polyfill. Not necessary when running unit tests.
import from 'babel/polyfill';
import css from 'css';

const SELECTOR_LIMIT = 4095;

function createAst(rules, selectorCount) {
  return {
    ast: {
      type: 'stylesheet',
      stylesheet: {
        rules: rules
      }
    },
    selectorCount: selectorCount
  };
}

function calculateSelectorLength(rule) {
  switch (rule.type) {
    case 'rule':
      return rule.selectors.length;
    case 'comment':
      return 0;
    default:
      return rule.rules.reduce((acc, rule) => acc + rule.selectors.length, 0);
  }
}

function *chunks(source) {
  let ast = css.parse(source);
  let rules = ast.stylesheet.rules;
  let splitRules = [];
  let selectorCount = 0;

  for(let i = 0; i < rules.length; i++) {
    let rule = rules[i];
    let ruleSelectorCount = calculateSelectorLength(rule);

    if (selectorCount + ruleSelectorCount > SELECTOR_LIMIT) {
      yield createAst(splitRules, selectorCount);
      splitRules = [];
      selectorCount = 0;
    }

    splitRules.push(rule);
    selectorCount += ruleSelectorCount;
  }

  yield createAst(splitRules);
}

export default function parse(source) {
  let totalSelectorCount = 0;
  let data = [];

  for(let { ast, selectorCount } of chunks(source)) {
    totalSelectorCount += selectorCount;
    data.push(css.stringify(ast));
  }

  return { data, totalSelectorCount };
}
