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
});

const Photo = model('Photo', photoSchema);
const Question = model('Question', questionSchema);

module.exports.Question = Question;
module.exports.Photo = Photo;
