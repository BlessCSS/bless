/* eslint no-process-exit: 0 */
import chalk from 'chalk';
import yargs from 'yargs';
import parseCliArgs from './parse-cli-args';

export default function cliExeute(argv) {
  let command;

  try {
    command = parseCliArgs(argv);
  } catch(err) {
    console.log(chalk.red(`Failed: ${err.toString()}`));
    if (err.stack) {
      console.log(chalk.red(err.stack));
    }
    console.log('');
    yargs.showHelp();
    return Promise.resolve(1);
  }

  return command.execute(command.options);
}
