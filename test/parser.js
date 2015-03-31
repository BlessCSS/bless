import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import parser from '../src/parser';
import _ from 'lodash';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const outputFixturesDir = path.join(__dirname, 'fixtures', 'output', 'parser');

function createTest(fixtureName) {
  return function(result) {
    return result.data.map((parserData, index) => {
      let outputFixtureFilename = index + '.css';
      let outputFixtureFilepath = path.join(outputFixturesDir, fixtureName, outputFixtureFilename);
      let outputFixtureData = fs.readFileSync(outputFixtureFilepath, {
        encoding: 'utf8'
      });
      parserData = parserData.replace(/\s+/g, '');
      outputFixtureData = outputFixtureData.replace(/\s+/g, '');
      return expect(parserData).to.equal(outputFixtureData);
    });
  };
}

function buildContext(fixtureName, filename) {
  return {
    [`with data from the fixture "${filename}"`]: {
      'should parse the CSS correctly'() {
        let inputFixtureFilepath = path.join(inputFixturesDir, filename);
        let inputFixtureData = fs.readFileSync(inputFixtureFilepath, { encoding: 'utf8' });
        let result = parser(inputFixtureData);
        return createTest(result);
      }
    }
  };
}

let inputFixtureFiles = fs.readdirSync(inputFixturesDir);

let spec = {
  Parser: inputFixtureFiles
    .filter(filename => /\.css$/.test(filename))
    .map(filename => {
      return {
        filename,
        fixtureName: path.basename(filename, path.extname(filename))
      };
    })
    .reduce((acc, { fixtureName, filename}) => {
      return _.extend({}, acc, buildContext(fixtureName, filename));
    }, {})
};

export default spec;
