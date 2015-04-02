/* eslint no-use-before-define: 0 */
import _ from 'lodash';
import path from 'path';
import fsp from 'fs-promise';
import css from 'css';
import { SELECTOR_LIMIT } from './constants';

function count(ast) {
  switch (ast.type) {
    case 'stylesheet':
      return ast.stylesheet.rules.reduce((acc, rule) => acc + count(rule), 0);
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
      return ast.rules
        .filter(rule => rule.selectors)
        .reduce((acc, rule) => acc + rule.selectors.length, 0);
  }
}

function countFile(filepath) {
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

function countDir(directory) {
  return fsp.readdir(directory)
    .then(files => {
      let fileCounts = files
        .map(f => path.join(directory, f))
        .map(countPath);

      return Promise.all(fileCounts)
        .then(results => _.flatten(results));
    });
}

function countPath(filepath) {
  return fsp.stat(filepath)
    .then(stat => {
      if (stat.isDirectory()) {
        return countDir(filepath);
      } else {
        return countFile(filepath);
      }
    });
}

export default {
  count,
  countPath
}
