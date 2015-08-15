/* eslint no-process-exit: 0 */
import 'colors';
import yargs from 'yargs';
import parseCliArgs from './parse-cli-args';

export default function cliExeute(argv) {
  let command;

  try {
    command = parseCliArgs(argv);
  } catch(err) {
    console.log(`Failed: ${err.toString()}`.red);
    if (err.stack) {
      console.log(err.stack.red);
    }
    console.log('');
    yargs.showHelp();
    return Promise.resolve(1);
  }

  return command.execute(command.options);
}
