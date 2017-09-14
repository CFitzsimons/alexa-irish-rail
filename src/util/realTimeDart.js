const parseString = require('xml2js').parseString;
const request = require('request');

const API_BASE = 'http://api.irishrail.ie/realtime/realtime.asmx/';
class RealTimeDart {
  static humanReadableDestinations(destinations) {
    if (destinations.length === 0) {
      return 'no destinations';
    }
    let stationString = `Which direction are you going? ${destinations[0]}`;
    let i = 1;
    for (i = 1; i < destinations.length - 1; i += 1) {
      stationString += `, ${destinations[i]}`;
    }
    if (destinations.length > 1) {
      stationString += ` or ${destinations[destinations.length - 1]}`;
    } else if (i !== 1) {
      stationString += destinations[0];
    }
    return stationString;
  }
  static humanReadableNext(trainData) {
    return `This service will arrive in ${trainData.Duein[0]} minutes and is bound for ${trainData.Destination[0]}`;
  }

  constructor(station, state) {
    this.station = station;
    this.index = 0;
    if (state) {
      this.station = state.station;
      this.index = state.index;
      this.destinationList = state.destinationList;
      this.stationData = state.stationData;
    }
  }

  next() {
    return new Promise((resolve) => {
      if (!this.stationData) {
        /* If stationList isn't built, build then call buildDestination again */
        this.buildStationList().then(() => {
          this.next().then(resolve);
        });
        return;
      }
      this.index += 1;
      resolve(RealTimeDart.humanReadableNext(this.stationData[this.index - 1]));
    });
  }
  isFinished() {
    return this.index >= this.stationData.length;
  }
  getState() {
    return {
      destinationList: this.destinationList,
      stationData: this.stationData,
      station: this.station,
      index: this.index,
    };
  }

  pruneDirections(direction) {
    return new Promise((resolve) => {
      if (!this.destinationList) {
        this.buildDestinationList().then(() => {
          this.pruneDirections(direction).then(resolve);
        });
        return;
      }
      if (this.destinationList.indexOf(direction.toLowerCase()) === -1) {
        resolve(`No services traveling ${direction}`);
        return;
      }
      const replacement = [];
      for (const service of this.stationData) {
        if (service.Direction[0].toLowerCase() === direction.toLowerCase()) {
          replacement.push(service);
        }
      }
      this.stationData = replacement;
      resolve(this.stationData);
    });
  }

  getDestinations() {
    return new Promise((resolve) => {
      if (this.destinationList) {
        resolve(RealTimeDart.humanReadableDestinations(this.destinationList));
        return;
      }
      this.buildDestinationList().then(() => {
        this.getDestinations().then(resolve);
      });
    });
  }

  /* Builds do not check for themselves existing, allowing for rebuilds */
  buildDestinationList() {
    return new Promise((resolve) => {
      if (!this.stationData) {
        /* If stationList isn't built, build then call buildDestination again */
        this.buildStationList().then(() => {
          this.buildDestinationList().then(resolve);
        });
        return;
      }
      /* Building destinationList from station data */
      this.destinationList = [];
      for (const station of this.stationData) {
        const destination = station.Direction[0];
        if (this.destinationList.indexOf(destination.toLowerCase()) === -1) {
          this.destinationList.push(destination.toLowerCase());
        }
      }
      resolve(this.destinationList);
    });
  }
  buildStationList() {
    const url = `${API_BASE}getStationDataByNameXML?StationDesc=${this.station}`;
    return new Promise((resolve) => {
      request(url, (error, response, body) => {
        parseString(body, (err, result) => {
          this.stationData = result.ArrayOfObjStationData.objStationData;
          resolve(this.stationData);
        });
      });
    });
  }
}

module.exports = RealTimeDart;