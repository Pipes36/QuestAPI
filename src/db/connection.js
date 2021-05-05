const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const URI = process.env.MONGOOSE_URL || 'mongodb://localhost/Quest'
const init = require('./init.js')
const { Question } = require('./view/schema.js');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err)
  console.log('could not connect to database');
})
db.once('open',async () => {
  console.log(`Successfully connected to DB at ${URI}`);
  const test = await Question.find({})
  if (!test.length) {
    const initialRun = await init(db);
    console.log('Initialized DB with DB, Collection, and Example Data');
  }
});

module.exports = db;
