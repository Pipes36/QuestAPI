const transform = require('./transform.js');

const parseQuestion = (question = {}) => {
  if (!question.body) return {};
  return {
    'question_id': transform.id(question.id),
    'product_id': transform.productID(question['product_id']),
    'question_body': transform.body(question.body),
    'question_date': transform.date(question['date_written']),
    'asker_name': transform.name(question['asker_name']),
    'asker_email': transform.email(question['asker_email']),
    reported: transform.reported(question.reported),
    'question_helpfulness': transform.helpfulness(question.helpful)
  };
};

module.exports =  parseQuestion;
