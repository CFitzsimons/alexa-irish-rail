const { fetchJSON, toSlot, write } = require('./scrape');

const queryString = 'http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML';

fetchJSON(queryString).then((res) => {
  const stationList = res.ArrayOfObjStation.objStation;
  const slots = [];
  const list = [];
  for (const station of stationList) {
    if (list.indexOf(station.StationDesc[0]) === -1) {
      list.push(station.StationDesc[0]);
      slots.push(toSlot(station.StationDesc[0]));
    }
  }
  write(slots, 'stationNames.json');
});
