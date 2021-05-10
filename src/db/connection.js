const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;
require('dotenv').config();
const URI = 'mongodb://quest-db:27017/Quest'
console.log(URI, 'LOOK HERE')

const init = require('./init.js')
const { Question } = require('./model/schema.js');
const { isEmpty } = require('lodash')

const db = (async () => {
  try {
    console.log('running')
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log('Successfully Connected to DB')
    const connection = mongoose.connection;
    const collectionSearch = await connection.db.listCollections().toArray();
    console.log(collectionSearch)
    if (isEmpty(collectionSearch)) {
      console.log('Initializing DB with Data');
      init();
    }
  } catch(err) {
    console.log(err);
    console.log('Error connecting to DB');
  }
})();


// const db = mongoose.connection;
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ---------------PLEASE NOTE BELOW DB POPULATION LOGIC ------------------------ */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
// console.log(db)
// db.then(() => {
//   console.log(`Successfully connected to DB at ${URI}`);
// }).catch((err) => console.log(err));

// db.on('error', (err) => {
//   console.log(err)
//   console.log('could not connect to database');
// })
// db.once('open', async () => {
//   console.log(`Successfully connected to DB at ${URI}`);
  //
  //  Below logic safeguards from unnecessary DB population
  //
  // const collectionSearch = await db.db.listCollections().toArray()
  // if (isEmpty(collectionSearch)) {
  //   console.log('Initializing DB with Data');
  //   init();
  // }
// });

module.exports = db;
