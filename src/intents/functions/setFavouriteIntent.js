const DatabaseProxy = require('../../util/database');
const allStations = require('../../util/stationNames.json');


function isValidStation(station) {
  for (let i = 0; i < allStations.length; i += 1) {
    if (station.toLowerCase() === allStations[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}

module.exports = function setFavourite() {
  if (!this.event.request.intent.slots
    || !this.event.request.intent.slots.StationName
    || !this.event.request.intent.slots.StationName.value) {
    this.emit(':delegate');
    return;
  }
  const slotValue = this.event.request.intent.slots.StationName.value;
  const slotStatus = this.event.request.intent.slots.StationName.confirmationStatus;
  if (!isValidStation(slotValue)) {
    this.emit(':elicitSlot', 'StationName', 'That doesn\'t appear to be a valid station, could you try again?', 'What station would you like to favourite?');
    return;
  }
  if (slotStatus === 'NONE') {
    this.emit(':confirmSlot', 'StationName', `Are you sure you want to set ${slotValue} as your favourite?`, `Is ${slotValue} correct?`);
  } else if (slotStatus === 'CONFIRMED') {
    const db = new DatabaseProxy(process.env.tableId, this.event.session.user.userId);
    db.store(slotValue).then(() => {
      this.emit(':tell', `I saved ${slotValue} as your favourite!`, `I saved ${slotValue} as your favourite!`);
    });
  } else {
    this.emit(':elicitSlot', 'StationName', 'Oh, OK.  What station would you like to favourite then?', 'What station would you like to favourite?');
  }
};
