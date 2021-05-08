"use strict"
const transform = require('./transform.js');

const parseAnswer = (answer = {}) => {
  if (!answer.body) return {};
  if (!answer['question_id'] && answer['question_id'] !== 0) return {};
  if(!answer.id && answer.id !== 0) return {};

  return {
    parent_question_id: transform.id(answer['question_id']),
    answer_id: transform.id(answer.id),
    answer_body: transform.body(answer.body),
    answer_date: transform.date(answer['date_written']),
    answerer_name: transform.name(answer['answerer_name']),
    reported: transform.reported(answer.reported),
    answer_helpfulness: transform.helpfulness(answer.helpful),
    answerer_email: transform.email(answer['answerer_email']),
    photos: transform.photos(answer.photos)
  }
}

module.exports = parseAnswer;
