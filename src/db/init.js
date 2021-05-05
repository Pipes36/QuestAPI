const { Question } = require('./view/schema.js');

// In order to initialize, Create the Database
// Then Create the Collection (Model),
// Then Run this Init to get a Random Data Point To Test

const init = (db) => {
  const newQ = new Question({
    product_id: '55',
    questions: [
      {
        question_id: 10293,
        question_date: 'this is a date',
        asker_name: 'kenny',
        reported: false,
        question_helpfulness: 2,
        asker_email: 'email@email.com',
        answers: [
          {
            answer_id: 5555,
            answer_body: 'qweqe',
            answer_date: 'this a date',
            answerer_name: 'sally',
            answer_helpfulness: 3
          }
        ]
      }
    ]
  });
  try {
    return newQ.save();
  } catch (err) {
    console.error(err)
  }
}

module.exports = init;
