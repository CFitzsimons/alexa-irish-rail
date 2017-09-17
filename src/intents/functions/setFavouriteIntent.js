const DatabaseProxy = require('../../util/database');

module.exports = function setFavourite() {
  if (!this.event.request
    || !this.event.request.intent
    || !this.event.request.intent.slots
    || !this.event.request.intent.slots.StationName
    || !this.event.request.intent.slots.StationName.value) {
    this.emit(':delegate');
    return;
  }
  const slotValue = this.event.request.intent.slots.StationName.value;
  const db = new DatabaseProxy(process.env.tableId, this.event.session.user.userId);
  db.store(slotValue).then(() => {
    this.emit(':tell', `I saved ${slotValue} as your favourite!`, `I saved ${slotValue} as your favourite!`);
  });
};