const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.promise = Promise;
const { Question, Answer } = require('../db/model/schema.js')

/*
 *
 *
 *
 * SETUP FOR ENDPOINTS.TEST.JS
 *
 *
 *
 */

const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.drop();
  }
};

const dropDatabase = async () => {
  await mongoose.connection.db.dropDatabase('TestQuest');
};

module.exports = {
  setupDB (databaseName) {
    // CONNECT TO MONGOOSE
    beforeAll(async () => {
      const url = `mongodb://127.0.0.1/${databaseName}`;
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

      await Question.createCollection();
      await Answer.createCollection();

      for (let i = 1; i <= 5; i++) {
        await Question.create({
          product_id: `${i}`,
          question_id: i,
          question_date: '2011-10-05T14:48:00.000Z',
          asker_name: `Test User${i}`,
          question_body: 'This is a test insertion for the Question Collection',
          reported: false,
          question_helpfulness: 3,
          asker_email: 'example@email.com'
        });

        await Answer.create({
          answer_id: i + i,
          parent_question_id: i,
          answer_body: 'This is a test insertion for the Answer Collection',
          answer_date: '2011-10-05T14:48:00.000Z',
          answerer_name: `Test User${i + i}`,
          reported: false,
          answer_helpfulness: 2,
          answerer_email: 'example@email.com',
          photos: [{
            photo_id: i,
            url: 'examplegoogle.com'
          }]
        });
      }
      return;
    });

    // CLEAN UP DB AFTER EACH TEST
    // afterEach(async () => {
    //   await removeAllCollections();
    // });

    // REMOVE ALL COLLECTIONS AND CLOSE CONNECTION
    afterAll(async () => {
      await removeAllCollections();
      await dropDatabase();
      await mongoose.connection.close();
    });
  }
};
