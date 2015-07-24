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

  yield createAst(splitRules, selectorCount);
}

export default function chunk(code, options) {
  let fullAst = css.parse(code, { source: options.source });
  let totalSelectorCount = 0;
  let data = [];
  let maps = [];

  for(let { ast, selectorCount } of chunks(fullAst)) {
    let stringified = css.stringify(ast, { sourcemap: options.sourcemaps });
    totalSelectorCount += selectorCount;
    if (options.source && options.sourcemaps) {
      data.push(stringified.code);
      maps.push(stringified.map);
    } else {
      data.push(stringified);
    }
  }

  return { data, maps, totalSelectorCount };
}
