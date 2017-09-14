const { fetchJSON, toSlot, write } = require('./scrape');

const queryString = 'http://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML';
const stationString = 'http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=';
// encodeURIComponent
fetchJSON(queryString).then((res) => {
  const stationList = res.ArrayOfObjStation.objStation;
  const promises = [];
  for (const station of stationList) {
    promises.push(fetchJSON(stationString + encodeURIComponent(station.StationDesc[0])));
  }
  const destinations = [];
  Promise.all(promises).then((allStationsData) => {
    for (const station of allStationsData) {
      if (!station || !station.ArrayOfObjStationData || !station.ArrayOfObjStationData.objStationData) continue;
      const stationData = station.ArrayOfObjStationData.objStationData;
      for (const service of stationData) {
        if (!service || !service.Direction) continue;
        const direction = service.Direction[0];
        if (destinations.indexOf(direction.toLowerCase()) === -1) {
          destinations.push(direction.toLowerCase());
        }
      }
    }
    const slots = [];
    for (const direct of destinations) {
      slots.push(toSlot(direct));
    }
    write(slots, 'destinations.json');
  });
  
});
