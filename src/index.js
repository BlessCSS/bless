// CLI Runner will work with pre-transpiled babel output, thus needing this
// polyfill. Not necessary when running unit tests. Babel will throw if this
// module is loaded twice. Using ES6 dynamic module loading will not work
// either since that polyfill will not be available till after a polyfill is
// loaded. Hence the reason for falling back to CommonJS style module import.
if (!global._babelPolyfill) {
  require('babel/polyfill');
}

import fsp from 'fs-promise';
import chunker from './chunk';
import _ from 'lodash';

function defaultOptions(options) {
  let _defaultOptions = {
    sourcemaps: false
  };

  if (_.isUndefined(options)) {
    options = {};
  }

  return _.defaults(options, _defaultOptions);
}

function chunk(code, options) {
  return chunker(code, defaultOptions(options));
}

function chunkFile(filepath, options) {
  return fsp.readFile(filepath, { encoding: 'utf8' })
    .then(code => {
      let chunkOptions = _.defaults(options, { source: filepath });
      return chunk(code, chunkOptions);
    });
}

export default {
  chunk,
  chunkFile
};
