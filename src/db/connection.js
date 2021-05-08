const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;
require('dotenv').config();
const URI = process.env.MONGOOSE_URL || 'mongodb://localhost/Quest'
const init = require('./init.js')
const { Question } = require('./model/schema.js');
const { isEmpty } = require('lodash')

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

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
db.once('open', async () => {
  console.log(`Successfully connected to DB at ${URI}`);
  //
  //  Below logic safeguards from unnecessary DB population
  //
  const collectionSearch = await db.db.listCollections().toArray()
  if (isEmpty(collectionSearch)) {
    console.log('Initializing DB with Data');
    init();
  }
});

module.exports = db;
