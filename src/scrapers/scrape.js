const request = require('request');
const parseString = require('xml2js').parseString;
const fs = require('fs');

function fetchJSON(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      parseString(body, (err, result) => {
        resolve(result);
      });
    });
  });
}
function toSlot(data, synonyms = []) {
  return {
    id: null,
    name: {
      value: data,
      synonyms,
    },
  };
}

function write(data, fileName) {
  if (!fs.existsSync('scarped')) {
    fs.mkdirSync('scarped');
  }
  fs.writeFile(`./scarped/${fileName}`, JSON.stringify(data, null, 1), (err) => {
    if (err) {
      console.log(err);
      console.error('Filewrite failed');
    }
  });
}

module.exports = {
  fetchJSON,
  toSlot,
  write,
};
