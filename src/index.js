import fsp from 'fs-promise';
import parser from './parser';

export function parse(code, options) {
  return parser(code, options);
}

export function parseFile(source) {
  return fsp.readFile(filename, { encoding: 'utf8' })
    .then(code => parse(code, { source }));
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
