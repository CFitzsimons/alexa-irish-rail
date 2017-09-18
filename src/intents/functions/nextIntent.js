const { NEXT_REPROMPT } = require('../../util/responses');
const { REALTIME_SESSION } = require('../../util/constants');
const RealTimeDart = require('../../util/realTimeDart');

module.exports = function next() {
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
};
