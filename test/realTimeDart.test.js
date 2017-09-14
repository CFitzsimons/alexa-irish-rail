/* eslint-env mocha */

const assert = require('assert');

const RealTimeDart = require('../src/util/realTimeDart');
const suttonStation = require('../scarped/test_sutton.json');

const defaultStation = 'Sutton';
const defaultDestinationList = 'Which direction are you heading? southbound or northbound';
let times;

beforeEach(() => {
  times = new RealTimeDart(defaultStation);
  times.destinationList = ['southbound', 'northbound'];
  times.stationData = suttonStation.ArrayOfObjStationData.objStationData;
});

describe('realTimeDart', () => {
  describe('#next()', () => {
    it('should wrap around', (done) => {
      const promises = [];
      for (let i = 0; i < times.stationData.length; i += 1) {
        promises.push(times.next());
      }
      Promise.all(promises).then(() => {
        assert.equal(0, times.index);
        done();
      });
    });
  });
  describe('#destinations', () => {
    it('should build list of destinations', (done) => {
      delete times.stationData;
      times.getDestinations().then((res) => {
        assert.equal(defaultDestinationList, res);
        done();
      });
    });
  });
});
