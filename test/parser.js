//let addContext, expect, fileExtension, filename, fixtureName, fs, i, inputFixtureFiles, len, parser, path, spec;

import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import parser from '../src/parser';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const outputFixturesDir = path.join(__dirname, 'fixtures', 'output', 'parser');

function addContext(fixtureName, test) {
  let context, inputFixtureData, inputFixtureFilename, inputFixtureFilepath, result;
  if (test == null) {
    test = function(result) {
      let i, index, len, outputFixtureData, outputFixtureFilename, outputFixtureFilepath, parserData, ref, results;
      ref = result.data;
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        parserData = ref[index];
        outputFixtureFilename = index + '.css';
        outputFixtureFilepath = path.join(outputFixturesDir, fixtureName, outputFixtureFilename);
        outputFixtureData = fs.readFileSync(outputFixtureFilepath, {
          encoding: 'utf8'
        });
        parserData = parserData.replace(/\s+/g, '');
        outputFixtureData = outputFixtureData.replace(/\s+/g, '');
        results.push(expect(parserData).to.equal(outputFixtureData));
      }
      return results;
    };
  }
  inputFixtureFilename = fixtureName + '.css';
  context = `with data from the fixture "${inputFixtureFilename}"`;
  spec.Parser[context] = {};
  inputFixtureFilepath = path.join(inputFixturesDir, inputFixtureFilename);
  inputFixtureData = fs.readFileSync(inputFixtureFilepath, {
    encoding: 'utf8'
  });
  result = parser(inputFixtureData);
  return spec.Parser[context]['should parse the CSS correctly'] = function() {
    return test(result);
  };
}

let spec = {
  Parser: {}
};

let inputFixtureFiles = fs.readdirSync(inputFixturesDir);

for (let i = 0, len = inputFixtureFiles.length; i < len; i++) {
  let filename = inputFixtureFiles[i];
  if (!/\.css$/.test(filename)) {
    continue;
  }
  let fileExtension = path.extname(filename);
  let fixtureName = path.basename(filename, fileExtension);
  addContext(fixtureName);
}

export default spec;
