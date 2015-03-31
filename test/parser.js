import { expect } from 'chai';
import fs from 'fs';
import fsp from 'fs-promise';
import path from 'path';
import parser from '../src/parser';
import _ from 'lodash';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const outputFixturesDir = path.join(__dirname, 'fixtures', 'output', 'parser');

function testParserResults(fixtureName, result) {
  return result.data.map((parserData, index) => {
    let outputFixtureFilename = index + '.css';
    let outputFixtureFilepath = path.join(outputFixturesDir, fixtureName, outputFixtureFilename);

    return fsp.readFile(outputFixtureFilepath, { encoding: 'utf8' })
      .then(outputFixtureData => {
        parserData = parserData.replace(/\s+/g, '');
        outputFixtureData = outputFixtureData.replace(/\s+/g, '');
        expect(parserData).to.equal(outputFixtureData);
      });
  });
}

function buildContext(fixtureName, filename) {
  return {
    [`with data from the fixture "${filename}"`]: {
      'should parse the CSS correctly'(done) {
        let inputFixtureFilepath = path.join(inputFixturesDir, filename);
        fsp.readFile(inputFixtureFilepath, { encoding: 'utf8' })
          .then(inputFixtureData => {
            let result = parser(inputFixtureData);
            return testParserResults(fixtureName, result);
          })
          .then(() => done())
          .catch(err => done(err));
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
