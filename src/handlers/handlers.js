const DatabaseProxy = require('../util/database');

const {
  help,
  stop,
  cancel,
  setFavourite,
} = require('../intents');

const {
  UNHANDLED,
  UNHANDLED_REPROMPT,
  NEXT_REPROMPT,
  FIRST_RUN,
  FIRST_RUN_REPROMPT,
} = require('../util/responses');

const { REALTIME_SESSION } = require('../util/constants');
const RealTimeDart = require('../util/realTimeDart');
/* Intent handlers */
module.exports = {
  'AMAZON.HelpIntent': help,
  'AMAZON.StopIntent': stop,
  'AMAZON.CancelIntent': cancel,
  SetFavouriteIntent: setFavourite,
  FirstRun: function () {
    this.emit(':ask', FIRST_RUN, FIRST_RUN_REPROMPT);
  },
  FavouriteIntent: function () {
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
  },
  NextIntent: function () {
    if (!this.attributes[REALTIME_SESSION]) {
      this.emit('FavouriteIntent');
      return;
    }
    const times = new RealTimeDart(null, this.attributes[REALTIME_SESSION]);
    times.next().then((nextSpeech) => {
      this.attributes[REALTIME_SESSION] = times.getState();
      let speech = nextSpeech;
      let type = ':ask';
      if (times.isFinished()) {
        type = ':tell';
        speech += 'This is the last service.';
      }
      this.emit(type, speech, NEXT_REPROMPT);
    });
  },
  LaunchRequest: function () {
    this.emit('FavouriteIntent');
  },
  Unhandled: function () {
    this.emit(':ask', UNHANDLED, UNHANDLED_REPROMPT);
  },
};

