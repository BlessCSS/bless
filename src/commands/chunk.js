import yargs from 'yargs';
import common from './common-yargs';

function execute(options) {
  console.log('chunk execute');
  console.log(options);
}

function yargsSetup() {
  yargs.command('chunk', 'breaks up css file to multiple files if it exceeds IE selector limits');
}

function examples() {
  yargs.example('$0 chunk <input file> [<output file>] [options]');
}

function parseArgs(argv){
  yargs.reset();

  common();
  examples();

  let options = yargs
    .help('h')
    .option('force', {
      alias: 'f',
      demand: false,
      default: false,
      describe: 'modify the input file provided'
    })
    .parse(argv);

  if (options.help) {
    return options;
  }

  options.input = options._.length > 0 ? options._[0] : null;
  options.output = options._.length > 1 ? options._[1] : null;

  if (!options.input) {
    throw 'No input provided';
  }

  if (!options.force && !options.output) {
    throw 'No output provided';
  }

  if (!options.force && options.input === options.output) {
    throw 'Use --force of -f to modify the input file';
  }

  return options;
}

export default {
  execute,
  examples,
  yargsSetup,
  parseArgs
}
