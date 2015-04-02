/* eslint no-process-exit: 0 */
import from 'colors';
import yargs from 'yargs';
import common from './common-yargs';
import { chunkFile } from '../index';
import path from 'path';
import fs from 'fs';
import fsp from 'fs-promise';
import { ensureDir, expand } from '../fs-utils';

function executeChunk(input, outputDir) {
  let basename = path.basename(input, '.css');

  return chunkFile(input)
    .then(({data, totalSelectorCount}) => {
      return data.map((ast, index) => {
        let outputFilename = path.join(outputDir, `${basename}.${index}.css`);

        return fsp.writeFile(outputFilename, ast);
      });
    });
}

function execute(options) {
  expand(options.input)
    .filter(x => /\.css$/.test(x))
    .map(filepath => {
      let relativeInputDir = path.relative(options.input, path.dirname(filepath));
      let outputDir = path.join(options.outDir, relativeInputDir);

      return ensureDir(outputDir)
        .then(() => executeChunk(filepath, outputDir));
    })
    .flatMap(x => x)
    .reduce((acc, x) => acc.concat([x]), [])
    .toPromise(Promise)
    .then(() => {
      console.log('complete');
    })
    .catch(err => {
      console.log(err.toString().red);
      process.exit(1);
    });
}

function yargsSetup() {
  yargs.command('chunk', 'breaks up css file to multiple files if it exceeds IE selector limits');
}

function examples() {
  yargs.example('$0 chunk <input file|directory>   (chunked files will reside next to input css files with the format *.##.css)');
  yargs.example('$0 chunk <input file|directory> --out-dir <output directory>');
}

function parseArgs(argv){
  yargs.reset();

  common();
  examples();

  let options = yargs
    .help('h')
    .alias('h', 'help')
    .option('out-dir', {
      description: 'output directory',
      type: 'string'
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
}

//fs.readFile(input, 'utf8', function(err, data) {
  //let dirname, extension, fileData, filename, index, logSummary, newFilename, numFiles, numFilesWritten, numSelectors, result, _i, _len, _ref, _results;
  //if (err) {
    //throw err;
  //}
  //result = parser(data);
  //numFiles = result.data.length;
  //numSelectors = result.numSelectors;
  //dirname = path.dirname(output);
  //extension = path.extname(output);
  //filename = path.basename(output, extension);
  //numFilesWritten = 0;
  //logSummary = function() {
    //let message;
    //message = [];
    //message.push('Input file contained ' + (formatNumber(numSelectors)) + ' ' + (pluralize('selector', numSelectors)) + '.');
    //if (numFiles > 1) {
      //message.push('' + (formatNumber(numFiles)) + ' ' + (pluralize('file', numFiles)) + ' created.');
    //} else {
      //message.push('No changes made.');
    //}
    //return console.log(message.join(' ').green.bold);
  //};
  //if (numFiles > 1) {
    //_ref = result.data;
    //_results = [];
    //for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      //fileData = _ref[index];
      //newFilename = '' + (path.join(dirname, filename)) + '-blessed' + (index + 1) + extension;
      //_results.push(fs.writeFile(newFilename, fileData, function(err) {
        //if (err) {
          //throw err;
        //}
        //console.log(('Created ' + newFilename).yellow);
        //numFilesWritten++;
        //if (numFilesWritten === numFiles) {
          //return logSummary();
        //}
      //}));
    //}
    //return _results;
  //} else {
    //return logSummary();
  //}
//});
