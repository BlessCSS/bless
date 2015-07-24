import { expect } from 'chai';
import path from 'path';
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
    [`with data from the fixture "${filename}" should chunk the css file correctly`]: {
      'with sourcemaps'(done) {
        let inputFixtureFilePath = path.join(inputFixturesDir, filename);
        chunkFile(inputFixtureFilePath, { sourcemaps: true })
          .then(results => {
            expect(results.data.length).to.be.equal(chunkCount, 'The number of chunks is incorrect');
            expect(results.data.length).to.be.equal(results.maps.length, 'There should be the same number of maps as chunks');
            expect(results.totalSelectorCount).to.be.equal(totalSelectorCount, 'The totalSelectorCount should be calculated');
          })
          .then(done)
          .catch(err => done(err));
      },
      'without sourcemaps'(done) {
        let inputFixtureFilePath = path.join(inputFixturesDir, filename);
        chunkFile(inputFixtureFilePath)
          .then(results => {
            expect(results.data.length).to.be.equal(chunkCount, 'The number of chunks is incorrect');
            expect(results.maps).to.be.empty;
            expect(results.totalSelectorCount).to.be.equal(totalSelectorCount, 'The totalSelectorCount should be calculated');
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
