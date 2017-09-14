const doc = require('dynamodb-doc');

class DatabaseProxy {
  constructor(tableId, userId) {
    this.userId = userId;
    this.database = new doc.DynamoDB();
    this.tableId = tableId;
  }

  store(favourite) {
    return new Promise((resolve) => {
      this.database.putItem({
        TableName: this.tableId,
        Item: {
          UserKey: this.userId,
          Station: favourite,
        },
      }, resolve);
    });
  }

  fetch() {
    return new Promise((resolve) => {
      this.database.getItem({
        TableName: this.tableId,
        Key: {
          UserKey: this.userId,
        },
      }, (error, result) => {
        resolve(result);
      });
    });
  }
}

module.exports = DatabaseProxy;
