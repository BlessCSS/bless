/* eslint no-process-exit: 0 */
import _ from 'lodash';
import yargs from 'yargs';
import common from './common-yargs';
import path from 'path';
import { countPath } from '../count';
import colors from 'colors';
import numberFormatter from 'format-number';
import columnify from 'columnify';
import { SELECTOR_LIMIT } from '../constants';

const formatNumber = numberFormatter();

function format(results, srcPath) {
  let formattedData = results
    .map(x => {
      let color = x.exceedsLimit ? colors.red : colors.green;
      let relativeFilepath = path.relative(srcPath, x.filepath);
      let formattedNumber = formatNumber(x.selectorCount);

      return {
        filepath: color(relativeFilepath),
        selectorCount: color(formattedNumber)
      };
    });

  let formattedResults = columnify(formattedData, {
    columnSplitter: '    ',
    config: {
      filepath: {
        headingTransform() { return 'File Path'.bold.underline; }
      },
      selectorCount: {
        headingTransform() { return `Selector Count (Limit: ${SELECTOR_LIMIT})`.bold.underline; }
      }
    }
  });

  return formattedResults;
}

function execute(options) {
  const srcPath = path.resolve(options.input);

  let countOptions = {
    progress(filepath) {
      process.stdout.write('.');
    }
  };

  countPath(srcPath, countOptions)
    .then(results => {
      console.log('');
      let formattedResults = format(results, srcPath);
      console.log(formattedResults);

      if (_.any(results, 'exceedsLimit')){
        process.exit(1);
      }
    })
    .catch(err => console.log(err.toString().red));
}

function yargsSetup() {
  yargs.command('count', 'checks an existing css file and fails if the selector count exceeds IE limits');
}

function examples() {
  yargs.example('$0 count <file|directory>');
  yargs.example('$0 count <file|directory> --no-color');
}

function parseArgs(argv){
  yargs.reset();

  common();
  examples();

  let options = yargs
    .help('h')
    .alias('h', 'help')
    .option('c', {
      alias: 'color',
      default: true,
      description: 'Colored output',
      type: 'boolean'
    })
    .parse(argv);

  options.input = options._.length > 0 ? options._[0] : null;

  if (!options.input) {
    throw 'No input provided';
  }

  return options;
}

export default {
  execute,
  examples,
  yargsSetup,
  parseArgs
};
