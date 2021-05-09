const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  product_id: { type: String, index: true },
  question_id: { type: Number, unique: true, index: true },
  question_date: String,
  asker_name: String,
  question_body: String,
  reported: Boolean,
  question_helpfulness: Number,
  asker_email: String
});

const answerSchema = new Schema({
  answer_id: { type: Number, unique: true, index: true },
  parent_question_id: Number,
  answer_body: String,
  answer_date: String,
  answerer_name: String,
  reported: Boolean,
  answer_helpfulness: Number,
  answerer_email: String,
  photos: [{
    photo_id: Number,
    url: String
  }]
});

const Answer = model('Answer', answerSchema);
const Question = model('Question', questionSchema);

module.exports.Question = Question;
module.exports.Answer = Answer;
