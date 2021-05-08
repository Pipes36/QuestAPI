const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  // _id === question_id
  _id: { type: Number, unique: true },
  product_id: String,
  question_date: String,
  asker_name: String,
  question_body: String,
  reported: Boolean,
  question_helpfulness: Number,
  asker_email: String,
  answers: [
    {
      // _id === answer_id
      _id: { type: Number, unique: true },
      answer_body: String,
      answer_date: String,
      answerer_name: String,
      reported: Boolean,
      answer_helpfulness: Number,
      answerer_email: String,
    }
  ]
});

const photoSchema = new Schema({
  answer_id: Number,
  photo_id: Number,
  url: String,
})

const Photo = model('Photo', photoSchema);
const Question = model('Question', questionSchema);

module.exports.Question = Question;
module.exports.Photo = Photo;
////////////////////////////////////////////
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
