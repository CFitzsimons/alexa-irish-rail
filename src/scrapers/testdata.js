const { fetchJSON, toSlot, write } = require('./scrape');

const queryString = 'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=';

const stations = ['sutton', 'howth junction', 'bray', 'cork'];

for (const station of stations) {
  fetchJSON(queryString + station).then((data) => {
    write(data, `test_${station}.json`);
  });
}
