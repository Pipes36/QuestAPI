const queries = require('../../db/controllers');
const convertIdToNumber = require('../helpers/convertIdToNumber');
const sanitizeInput = require('../helpers/sanitizeInput');
const checkProductId = require('../helpers/sanitizeInput');

module.exports = {
  async getQuestion(req, res) {
    try {
      const product_id = checkProductId(req.headers.product_id);
      // TODO: Sanitize Page and Count
      const queryResult = await queries.findQuestions(product_id, req.headers.page, req.headers.count);
      res.send(queryResult);
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Could not retrieve the question.')
    }
  },

  async createQuestion(req, res) {
    try {
      checkProductId(req.body.product_id);
      const sanitizedInput = sanitizeInput(req.body);
      await queries.addQuestion(sanitizedInput);
      res.status(201).send('Successfully saved your question!');
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Could not create your question.');
    }
  },

  async updateQuestionHelpfulness(req, res) {
    try {
      const question_id = convertIdToNumber(req.params.question_id);
      const questionHelpfulnessQuery = await queries.incrementQuestionHelpfulness(question_id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Check the sent parameters.');
    }
  },

  async updateQuestionReported(req, res) {
    try {
      const question_id = convertIdToNumber(req.params.question_id);
      await queries.markQuestionReported(question_id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(404).send('Something went wrong! Check the sent parameters.');
    }
  }
}