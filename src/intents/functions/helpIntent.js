const { HELP } = require('../../util/responses');
// const Debugger = require('../util/debugger');

module.exports = function help() {
  // if (!this.emit) {
  //   Debugger.log('\'this\' was not bound in helpIntent');
  //   return;
  // }
  this.emit(':ask', HELP, HELP);
};
