import chalk from 'chalk';
import yargs from 'yargs';
import common from './common-yargs';
import { chunkFile } from '../index';
import path from 'path';
import fs from 'fs';
import fsp from 'fs-promise';
import { ensureDir, expand } from '../fs-utils';

async function executeChunk(input, outputDir, chunkOptions) {
  let basename = path.basename(input, '.css');

  const {data, maps, totalSelectorCount} = await chunkFile(input, chunkOptions);

  let chunkData = data.map((ast, index) => {
    let outputFilename = path.join(outputDir, `${basename}.${index}.css`);

    return fsp.writeFile(outputFilename, ast);
  });

  let sourcemaps = maps.map((sourcemap, index) => {
    let outputFilename = path.join(outputDir, `${basename}.${index}.css.map`);

    return fsp.writeFile(outputFilename, JSON.stringify(sourcemap));
  });

  const chunks = await Promise.all(chunkData);
  await Promise.all(sourcemaps);

  return chunks;
}

function execute(options) {
  return expand(options.input)
    .filter(x => /\.css$/.test(x))
    .map(filepath => {
      let outputDir = options.outDir;

      return ensureDir(outputDir)
        .then(() => executeChunk(filepath, outputDir, { sourcemaps: options.sourcemaps }));
    })
    .flatMap(x => x)
    .reduce((acc, x) => acc.concat([x]), [])
    .toPromise(Promise)
    .then(() => {
      console.log(chalk.green('Complete'));
      return 0;
    });
}

function yargsSetup() {
  yargs.command('chunk', 'breaks up css file to multiple files if it exceeds IE selector limits');
}

function examples() {
  yargs.example('$0 chunk <input file|directory>   (chunked files will reside next to input css files with the format *.##.css)');
  yargs.example('$0 chunk <input file|directory> --out-dir <output directory>');
  yargs.example('$0 chunk <input file|directory> --sourcemaps');
}

function parseArgs(argv){
  yargs.reset();

  common();
  examples();

  let options = yargs
    .help('h')
    .alias('h', 'help')
    .options({
      'out-dir': {
        description: 'output directory',
        type: 'string'
      },
      'sourcemaps': {
        description: 'ouput sourcemaps',
        type: 'boolean'
      }
    })
    .parse(argv);

  if (options.help) {
    return options;
  }

  options.input = options._.length > 0 ? options._[0] : null;

  if (!options.input) {
    throw 'No input provided';
  }

  options.input = path.resolve(options.input);

  if (!options.outDir) {
    if (fs.statSync(options.input).isDirectory()) {
      options.outDir = options.input;
    } else {
      options.outDir = path.dirname(options.input);
    }
  } else {
    options.outDir = path.resolve(options.outDir);
  }

  return options;
}

export default {
  execute,
  examples,
  yargsSetup,
  parseArgs
};
