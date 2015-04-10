import fsp from 'fs-promise';
import polyfill from 'babel/polyfill';
import chunker from './chunk';
import _ from 'lodash';

function defaultOptions(options) {
  let defaultOptions = { sourcemaps: false };
  if (_.isUndefined(options)) { options = {} };
  return _.defaults(options, defaultOptions);
}

function chunk(code, options) {
  return chunker(code, defaultOptions(options));
}

function chunkFile(filepath, options) {
  return fsp.readFile(filepath, { encoding: 'utf8' })
    .then(code => {
      let chunkOptions = _.defaults(options, { source: filepath });
      return chunk(code, chunkOptions)
    });
}

export default {
  chunk,
  chunkFile
}
