const transform = require('./transform.js');

const parseQuestion = (question = {}) => {
  if (!question.body) return {};
  return {
    'question_id': transform.questionID(question.id),
    'product_id': transform.productID(question['product_id']),
    'question_body': transform.questionBody(question.body),
    'question_date': transform.questionDate(question['date_written']),
    'asker_name': transform.askerName(question['asker_name']),
    'asker_email': transform.askerEmail(question['asker_email']),
    reported: transform.reported(question.reported),
    'question_helpfulness': transform.questionHelpfulness(question.helpful)
  };
};

module.exports =  parseQuestion;
