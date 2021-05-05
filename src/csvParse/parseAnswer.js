const transform = require('./transform.js');

const parseAnswer = (answer = {}) => {
  if (!answer.body) return {};
  return {
    'answer_id': transform.id(answer.id),
    'question_id': transform.id(answer['question_id']),
    'answer_body': transform.body(answer.body),
    'answer_date': transform.date(answer['date_written']),
    'answerer_name': transform.name(answer['answerer_name']),
    'answerer_email': transform.email(answer['answerer_email']),
    reported: transform.reported(answer.reported),
    'answer_helpfulness': transform.helpfulness(answer.helpful),
    photos: transform.photos(answer.photos)
  }
}

module.exports = parseAnswer;
