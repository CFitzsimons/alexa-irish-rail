module.exports = function stop() {
  const speechOutput = 'Goodbye';
  this.emit(':tell', speechOutput);
};
