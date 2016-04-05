/* eslint no-use-before-define: 0 */
import fsp from 'fs-promise';
import css from 'css';
import { SELECTOR_LIMIT } from './constants';
import { expand } from './fs-utils';

function count(ast) {
  function countRules(rules) {
    return rules.reduce((acc, rule) => acc + count(rule), 0);
  }

  switch (ast.type) {
    case 'stylesheet':
      return countRules(ast.stylesheet.rules);
    case 'rule':
      return ast.selectors.length;
    // Don't affect selector limit
    case 'comment':
    case 'font-face':
    case 'keyframes':
    case 'import':
    case 'supports':
    case 'charset':
    case 'namespace':
      return 0;
    case 'page':
      return 1;
    default:
      return countRules(ast.rules);
  }
}

function countFile(filepath, options) {
  return fsp.readFile(filepath, { encoding: 'utf8' })
    .then(contents => {
      let ast = css.parse(contents);
      let selectorCount = count(ast);

      return {
        filepath,
        selectorCount,
        exceedsLimit: selectorCount > SELECTOR_LIMIT
      };
    });
}

function countPath(filepath, options) {
  options = options || {};

  return expand(filepath)
    .filter(x => /\.css$/.test(x))
    .map(x => countFile(x, options))
    .flatMap(x => {
      if (options.progress) {
        options.progress(x.filepath);
      }

      return x;
    })
    .reduce((acc, x) => acc.concat([x]), [])
    .toPromise(Promise);
}

export default {
  count,
  countPath
};
