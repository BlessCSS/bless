// CLI Runner will work with pre-transpiled babel output, thus needing this
// polyfill. Not necessary when running unit tests.
import from 'babel/polyfill';
import css from 'css';
import { count } from './count';
import { SELECTOR_LIMIT } from './constants';

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

function *chunks(ast) {
  let rules = ast.stylesheet.rules;
  let splitRules = [];
  let selectorCount = 0;

  for(let i = 0; i < rules.length; i++) {
    let rule = rules[i];
    let ruleSelectorCount = count(rule);

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

export default function chunk(code, options) {
  let fullAst = css.parse(code, options);
  let totalSelectorCount = 0;
  let data = [];

  for(let { ast, selectorCount } of chunks(fullAst)) {
    totalSelectorCount += selectorCount;
    data.push(css.stringify(ast));
  }

  return { data, totalSelectorCount };
}
