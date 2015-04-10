import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import fsp from 'fs-promise';
import { chunkFile } from '../src';
import _ from 'lodash';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const testExpectations = [
  { filename: 'over-limit.css', expectations: { totalSelectorCount: 4096, chunkCount: 2 } },
  { filename: 'under-limit.css', expectations: { totalSelectorCount: 4095, chunkCount: 1 } },
  { filename: 'no-selectors.css', expectations: { totalSelectorCount: 0, chunkCount: 1 } }
];

function buildContext(filename, { chunkCount, totalSelectorCount }) {
  return {
    [`with data from the fixture "${filename}"`]: {
      'should chunk the css file correctly'(done) {
        let inputFixtureFilePath = path.join(inputFixturesDir, filename);
        chunkFile(inputFixtureFilePath)
          .then(results => {
            expect(results.data.length).to.be.equal(chunkCount);
            expect(results.totalSelectorCount).to.be.equal(totalSelectorCount);
          })
          .then(done)
          .catch(err => done(err));
      }
    }
  };
}

let spec = {
  ChunkFile: testExpectations
    .reduce((acc, { filename, expectations }) => {
      return _.extend({}, acc, buildContext(filename, expectations));
    }, {})
};

export default spec;
