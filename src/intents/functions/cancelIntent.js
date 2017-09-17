module.exports = function cancel() {
  const speechOutput = 'Goodbye';
  this.emit(':tell', speechOutput);
};
