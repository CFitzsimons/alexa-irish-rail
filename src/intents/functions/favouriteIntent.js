const DatabaseProxy = require('../../util/database');
const RealTimeDart = require('../../util/realTimeDart');
const { REALTIME_SESSION } = require('../../util/constants');

module.exports = function favourite() {
  /* Cases:
  *    1. No favourite set: First run, ask the user to set a favourite
  *    2. Favourite set: Construct object and call next.
  */
  const db = new DatabaseProxy(process.env.tableId, this.event.session.user.userId);
  db.fetch().then((res) => {
    /* No favourite station found */
    if (!res.Item || !res.Item.Station) {
      this.emit('FirstRun');
      return;
    }
    const times = new RealTimeDart(res.Item.Station, this.attributes[REALTIME_SESSION]);
    times.buildDestinationList().then(() => {
      this.attributes[REALTIME_SESSION] = times.getState();
      this.emit('NextIntent');
    });
  });
};
