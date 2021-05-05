const db = require('../connection.js');
const { Schema, model } = require('mongoose');

const questionSchema = new Schema({
  product_id: String,
  questions: [Schema.Types.Mixed]
});

const Question = model('Question', questionSchema);

module.exports.questionSchema = questionSchema;
module.exports.Question = Question;
