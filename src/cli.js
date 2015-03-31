/* eslint no-process-exit: 0 */
import from 'colors';
import yargs from 'yargs';
import parseCliArgs from './parse-cli-args';

let options;

try {
  options = parseCliArgs(process.argv);
  console.log(options);
} catch(err) {
  console.log(`Failed: ${err.toString()}`.red);
  console.log(yargs.help());
  process.exit(1);
}


