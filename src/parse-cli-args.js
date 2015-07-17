import yargs from 'yargs';
import { version } from '../package.json';
import common from './commands/common-yargs';
import commands from './commands';

const help = {
  options: null,
  execute: yargs.showHelp
};

export default function parseCliArgs(argv) {
  if (argv === process.argv) {
    argv = argv.slice(2);
  }

  common(yargs);

  yargs
    .version(`v${version}`)
    .alias('version', 'v')
    .wrap(null);

  Object.keys(commands)
    .map(key => commands[key])
    .forEach(x => {
      if (x.yargsSetup) {
        x.yargsSetup();
      }

      if (x.examples) {
        x.examples();
      }
    });

  let commandOptions = yargs.parse(argv);

  let command = commandOptions._[0];

  if (!command) {
    if (commandOptions.help) {
      return help;
    }

    throw 'No command provided';
  }

  let options = commands[command].parseArgs(argv.slice(1));

  if (commandOptions.help) {
    return help;
  }

  return {
    options,
    execute: commands[command].execute
  };
}
