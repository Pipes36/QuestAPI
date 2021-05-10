const router= require('express').Router();
const { questions, answers } = require('../controllers');

router.put('/:question_id/helpful', questions.updateQuestionHelpfulness);

router.put('/:question_id/report', questions.updateQuestionReported);

router.get('/:question_id/answers', answers.getAnswers);

router.post('/:question_id/answers', answers.createAnswer);

router.post('/', questions.createQuestion);

router.get('/', questions.getQuestion);

module.exports = router;
