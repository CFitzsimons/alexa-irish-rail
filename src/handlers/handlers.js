const {
  help,
  stop,
  cancel,
  setFavourite,
  favourite,
  next,
} = require('../intents');

const {
  UNHANDLED,
  UNHANDLED_REPROMPT,
  FIRST_RUN,
  FIRST_RUN_REPROMPT,
} = require('../util/responses');

/* Intent handlers */
module.exports = {
  'AMAZON.HelpIntent': help,
  'AMAZON.StopIntent': stop,
  'AMAZON.CancelIntent': cancel,
  SetFavouriteIntent: setFavourite,
  FavouriteIntent: favourite,
  NextIntent: next,
  LaunchRequest: function () {
    this.emit('FavouriteIntent');
  },
  Unhandled: function () {
    this.emit(':ask', UNHANDLED, UNHANDLED_REPROMPT);
  },
  FirstRun: function () {
    this.emit(':ask', FIRST_RUN, FIRST_RUN_REPROMPT);
  },
};

