/* eslint no-use-before-define: 0 */
import _ from 'lodash';
import path from 'path';
import fsp from 'fs-promise';
import css from 'css';
import { SELECTOR_LIMIT } from './constants';

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
      return 0;
    default:
      return countRules(ast.rules);
  }
}

function countFile(filepath, options) {
  return fsp.readFile(filepath, { encoding: 'utf8' })
    .then(contents => {
      let ast = css.parse(contents);
      let selectorCount = count(ast);

      if (options.progress) {
        options.progress(filepath);
      }

      return {
        filepath,
        selectorCount,
        exceedsLimit: selectorCount > SELECTOR_LIMIT
      };
    });
}

function countDir(directory, options) {
  return fsp.readdir(directory)
    .then(files => {
      let fileCounts = files
        .map(f => path.join(directory, f))
        .map(f => countPath(f, options));

      return Promise.all(fileCounts)
        .then(results => _.flatten(results).filter(r => r !== undefined));
    });
}

function countPath(filepath, options) {
  options = options || {};
  return fsp.stat(filepath)
    .then(stat => {
      if (stat.isDirectory()) {
        return countDir(filepath, options);
      } else if (path.extname(filepath) === '.css') {
        return countFile(filepath, options);
      }
    });
}

export default {
  count,
  countPath
}
