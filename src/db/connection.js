const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;
require('dotenv').config();
const URI = process.env.MONGOOSE_URI;
console.log(URI, 'LOOK HERE')

const init = require('./init.js')
const { Question } = require('./model/schema.js');
const { isEmpty } = require('lodash')

/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */
/* ---------------PLEASE NOTE BELOW DB POPULATION LOGIC ------------------------ */
/* ----------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------- */

const db = (async () => {
  try {
    console.log('running')
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log('Successfully Connected to DB')
    const connection = mongoose.connection;
    //  ---------------------------------------------------------------------------------
    //  Logic Below Safeguards DB Population
    //  The line below should only be uncomment if you want to upload data to the DB
    //
    // ------------------------------------------------------------------------------
    // const collectionSearch = await connection.db.listCollections().toArray();
    // if (isEmpty(collectionSearch)) {
    //   console.log('Initializing DB with Data');
    //   init();
    // }
  } catch(err) {
    console.log(err);
    console.log('Error connecting to DB');
  }
})();

module.exports = db;
