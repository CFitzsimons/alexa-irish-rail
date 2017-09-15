const DatabaseProxy = require('../util/database');

const { 
  NO_FAVOURITE,
  NO_DIRECTION_ATTRIBUTE,
  NO_FAVOURITE_REPEAT,
  NO_TRAINS,
  NO_SERVICE,
  HELP,
  UNHANDLED,
  UNHANDLED_REPROMPT,
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
        const db = new DatabaseProxy(process.env.tableId, userId);
        db.store(this.event.request.intent.slots.StationName.value).then(() => {
          this.emit(':tell', `Alright, I set ${this.event.request.intent.slots.StationName.value} as your favourite station.`, `Alright, I set ${this.event.request.intent.slots.StationName.value} as your favourite station.`);
        });
      },
      DirectionIntent: function () {
        if (!this.attributes[REALTIME_SESSION] || !this.event.request.intent.slots.DirectionSlot) {
          this.emit(':tell', NO_DIRECTION_ATTRIBUTE, NO_DIRECTION_ATTRIBUTE);
          return;
        }
        const times = new RealTimeDart(null, this.attributes[REALTIME_SESSION]);
        times.pruneDirections(this.event.request.intent.slots.DirectionSlot.value.toLowerCase()).then(() => {
          if (times.stationData.length === 0) {
            this.emit(':tell', NO_TRAINS, NO_TRAINS);
            return;
          }
          times.next().then((res) => {
            if (times.isFinished()) { // Looped
              this.attributes[REALTIME_SESSION] = times.getState();
              this.emit(':tell', `This is the last train.  ${res}`, res);
              return;
            }
            this.attributes[REALTIME_SESSION] = times.getState();
            this.emit(':ask', res, res);
          });
        });
      },
      NextIntent: function () {
        if (!this.attributes[REALTIME_SESSION]) {
          this.emit(':tell', NO_DIRECTION_ATTRIBUTE, NO_DIRECTION_ATTRIBUTE);
          return;
        }
        const times = new RealTimeDart(null, this.attributes[REALTIME_SESSION]);
        times.next().then((res) => {
          if (times.isFinished()) { // Looped
            this.attributes[REALTIME_SESSION] = times.getState();
            this.emit(':tell', `The next service is the last.  ${res}`, res);
            return;
          }
          this.attributes[REALTIME_SESSION] = times.getState();
          this.emit(':ask', res, res);
        });
      },
      LaunchRequest: function () {
        const db = new DatabaseProxy(process.env.tableId, userId);
        db.fetch().then((response) => {
          if (response.Item && response.Item.Station) {
            /* Preform lookup */
            const times = new RealTimeDart(response.Item.Station);
            times.getDestinations().then((res) => {
              if (res === 'NONE') {
                this.emit(':tell', NO_SERVICE, NO_SERVICE);
                return;
              }
              this.attributes[REALTIME_SESSION] = times.getState();
              this.emit(':ask', res, res);
            });
            return;
          }
          /* No favourite is set, ask the user if they'd like to set one. */
          this.emit(':ask', NO_FAVOURITE, NO_FAVOURITE_REPEAT);
        });
      },
      Unhandled: function () {
        this.emit(':ask', UNHANDLED, UNHANDLED_REPROMPT);
      },
    };
  },
};

