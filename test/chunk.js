import { expect } from 'chai';
import fs from 'fs';
import fsp from 'fs-promise';
import path from 'path';
import chunk from '../src/chunk';
import _ from 'lodash';
import { ensureDir } from '../src/fs-utils';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const outputFixturesDir = path.join(__dirname, 'fixtures', 'output', 'chunk');
const outputDebugDirRoot = path.join(__dirname, 'fixtures', 'output-debug');
const outputDebugDir = path.join(__dirname, 'fixtures', 'output-debug', 'chunk');

let ensureDebugDir = ensureDir(outputDebugDirRoot)
  .then(() => ensureDir(outputDebugDir));

function testParserResults(fixtureName, result) {
  let dataChecks = result.data.map((chunkData, index) => {
    let outputFixtureFilename = index + '.css';
    let outputFixtureFilepath = path.join(outputFixturesDir, fixtureName, outputFixtureFilename);
    let outputDebugFilepath = path.join(outputDebugDir, fixtureName, outputFixtureFilename);

    return ensureDebugDir
      .then(() => ensureDir(path.dirname(outputDebugFilepath)))
      .then(() => Promise.all([
          fsp.readFile(outputFixtureFilepath, { encoding: 'utf8' }),
          fsp.writeFile(outputDebugFilepath, chunkData)
        ])
        .then(([d, ]) => d)
      )
      .then(outputFixtureData => {
        let safeChunkData = chunkData.replace(/\s+/g, '');
        let sageOutputFixtureData = outputFixtureData.replace(/\s+/g, '');
        expect(safeChunkData).to.equal(sageOutputFixtureData);
      });
  });

  return Promise.all(dataChecks);
}

function buildContext(fixtureName, filename) {
  return {
    [`with data from the fixture "${filename}"`]: {
      'should parse the CSS correctly'(done) {
        let inputFixtureFilepath = path.join(inputFixturesDir, filename);
        fsp.readFile(inputFixtureFilepath, { encoding: 'utf8' })
          .then(inputFixtureData => {
            let result = chunk(inputFixtureData);
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
