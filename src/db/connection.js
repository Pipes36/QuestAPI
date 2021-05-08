const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;
require('dotenv').config();
const URI = process.env.MONGOOSE_URL || 'mongodb://localhost/Quest'
const init = require('./init.js')
const { Question } = require('./model/schema.js');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err)
  console.log('could not connect to database');
})
db.once('open', async () => {
  console.log(`Successfully connected to DB at ${URI}`);
  //
  //  Below logic safeguards from unnecessary DB population
  //
  const isDatabasePopulated = await Question.find({});
  if (!isDatabasePopulated.length) {
    init();
  }
});

module.exports = db;