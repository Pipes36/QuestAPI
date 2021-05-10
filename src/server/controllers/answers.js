const queries = require('../../db/controllers');
const convertIdToNumber = require('../helpers/convertIdToNumber');
const sanitizeInput = require('../helpers/sanitizeInput');

module.exports = {
  async getAnswers(req, res) {
    try {
      const question_id = convertIdToNumber(req.params.question_id);
      // TODO: Sanitize Page and Count
      const answers = await queries.findAnswers(question_id, req.params.page, req.params.count);
      res.setHeader('Content-Type', 'application/json');
      res.send(answers);
    } catch (err) {
      console.error(err);
      res.status(404).send('Could not retrieve the answers.')
    }
  },

  async createAnswer(req, res) {
    try {
      const inputSanitized = sanitizeInput(req.body);
      const question_id = convertIdToNumber(req.params.question_id);
      const queryResult = await queries.addAnswer(question_id, inputSanitized);
      res.status(201).send('Successfully saved your answer!');
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Could not save your answer.')
    }
  },

  async updateAnswerHelpfulness(req, res) {
    try {
      const answer_id = convertIdToNumber(req.params.answer_id);
      await queries.incrementAnswerHelpfulness(answer_id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Check sent parameters.');
    }
  },

  async updateAnswerReported(req, res) {
    try {
      const answer_id = convertIdToNumber(req.params.answer_id);
      await queries.markAnswerReported(answer_id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Check sent parameters.');
    }
  }
}