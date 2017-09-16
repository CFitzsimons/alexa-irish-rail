const DatabaseProxy = require('../util/database');

const {
  HELP,
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
  getIntents: (userId) => {
    return {
      'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP, HELP);
      },
      'AMAZON.StopIntent': function () {
        const speechOutput = 'Goodbye';
        this.emit(':tell', speechOutput);
      },

      'AMAZON.CancelIntent': function () {
        const speechOutput = 'Goodbye';
        this.emit(':tell', speechOutput);
      },
      SetFavouriteIntent: function () {
        if (!this.event.request
          || !this.event.request.intent
          || !this.event.request.intent.slots
          || !this.event.request.intent.slots.StationName
          || !this.event.request.intent.slots.StationName.value) {
          this.emit(':delegate');
          return;
        }
        const slotValue = this.event.request.intent.slots.StationName.value;
        const db = new DatabaseProxy(process.env.tableId, userId);
        db.store(slotValue).then(() => {
          this.emit(':tell', `I saved ${slotValue} as your favourite!`, `I saved ${slotValue} as your favourite!`);
        });
      },
      FirstRun: function () {
        this.emit(':ask', FIRST_RUN, FIRST_RUN_REPROMPT);
      },
      FavouriteIntent: function () {
        /* Cases:
        *    1. No favourite set: First run, ask the user to set a favourite
        *    2. Favourite set: Construct object and call next.
        */
        const db = new DatabaseProxy(process.env.tableId, userId);
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
  },
};

