module.exports = {
  log: (message) => {
    console.info(`[${Date.now()}]: ${message}`);
  },
  error: (message) => {
    console.error(`[${Date.now()}]: ${message}`);
  },
};
