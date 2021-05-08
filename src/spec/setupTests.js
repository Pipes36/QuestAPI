const mongoose = require('mongoose');
const databaseName = 'TestQuest';
const Promise = require('bluebird');
mongoose.promise = Promise;

const removeAllCollections = async () => {

};

const dropAllCollections = async () => {

};

module.exports = {
  setupDB (databaseName) {
    // Connect to Mongoose
    beforeAll(async () => {
      const url = `mongodb://127.0.0.1/${databaseName}`
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    })

    // Cleans up database between each test
    afterEach(async () => {
      await removeAllCollections()
    })

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections()
      await mongoose.connection.close()
    })
  }
};
