const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;
require('dotenv').config();
const URI = process.env.MONGOOSE_URL || 'mongodb://localhost/Quest'
const init = require('./init.js')
const { Question } = require('./model/schema.js');
const { isEmpty } = require('lodash')

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })

const db = mongoose.connection;
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ---------------PLEASE NOTE BELOW DB POPULATION LOGIC ------------------------ */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */

db.on('error', (err) => {
  console.log(err)
  console.log('could not connect to database');
})
db.once('open', () => {
  console.log(`Successfully connected to DB at ${URI}`);
  //
  //  Below logic safeguards from unnecessary DB population
  //
  const isDatabasePopulated = Question.find({});
  if (isEmpty(isDatabasePopulated)) {
    console.log('Initializing DB with Data');
    init();
  }
});

module.exports = db;
