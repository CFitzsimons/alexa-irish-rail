const Alexa = require('alexa-sdk');
const handlers = require('./handlers/handlers');

/* Basic config check */
if (!process.env.appId) {
  console.error('Please ensure you have set the appId environment variable. (env.appId)');
  process.exit(1);
}
if (!process.env.tableId) {
  console.error('Please ensure you supply the name of the table. (env.tableId)');
  process.exit(1);
}

/* Alexa Handlers are pulled from /handlers and given here */
exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = process.env.appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
