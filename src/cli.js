/* eslint no-process-exit: 0 */
import 'colors';
import yargs from 'yargs';
import parseCliArgs from './parse-cli-args';

let command;

try {
  command = parseCliArgs(process.argv);
} catch(err) {
  console.log(`Failed: ${err.toString()}`.red);
  if (err.stack) {
    console.log(err.stack.red);
  }
  console.log('');
  yargs.showHelp();
  process.exit(1);
}

command.execute(command.options);
