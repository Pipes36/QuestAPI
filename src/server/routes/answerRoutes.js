const router = require('express').Router();
const { answers } = require('../controllers');

router.put('/:answer_id/helpful', answers.updateAnswerHelpfulness);

router.put('/:answer_id/report', answers.updateAnswerReported);

module.exports = router;
