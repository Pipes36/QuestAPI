const { Question, Answer } = require('../model/schema.js');
const parseAnswer = require('../../csvParse/parseAnswer');
const parseQuestion = require('../../csvParse/parseQuestion');
const client = require('../../cache/redis.js');

module.exports = {
  async findQuestions(product_id, page = 0, count = 5) {

    if (await client.get(product_id) != null) {
      console.log('Retrieving question from Redis cache');
      return JSON.parse(await client.get(product_id));
    }

    const matchingQuestions = await Question.find({ product_id}).lean();

    for (const question of matchingQuestions) {
      question.answers = {};
      const answers = await Answer.find(
        { parent_question_id: question.question_id },
        { _id: 0, parent_question_id: 0 }
      );
      answers.forEach((answer) => {
        question.answers[answer.answer_id] = answer;
      });
    }

    const responseResult = {
      product_id,
      results: matchingQuestions
    };

    await client.set(product_id, JSON.stringify(responseResult), 'EX', 60);

    return responseResult;
  },

  async findAnswers(question_id, page = 0, count = 5) {
    // TODO: page and count logic
    if (await client.get(`question_id:${question_id}`)) {
      console.log('Retrieving answer from Redis Cache');
      return JSON.parse(await client.get(`question_id:${question_id}`));
    }

    const queryResults = await Answer
      .find(
        {parent_question_id: question_id, reported: false },
        { _id: 0, parent_question_id: 0 })
      .sort({ answer_id: 1 });

    const responseResult = {
      question: String(question_id),
      page,
      count,
      results: queryResults
    }

    await client.set(`question_id:${question_id}`, JSON.stringify(responseResult), 'EX', 30);

    return responseResult;
  },

  async addQuestion({ body, name, email, product_id }) {
    const maxQuestionId = await Question
      .find({}, { question_id: 1, _id: 0 })
      .sort({ question_id: -1 })
      .limit(1);
    const newUniqueQuestionId = maxQuestionId[0].question_id + 1;
    const questionFormattedIntoSchema = parseQuestion({
      id: newUniqueQuestionId,
      product_id,
      body,
      date_written: Date.now(),
      asker_name: name,
      asker_email: email,
      reported: false,
      helpful: 0
    });
    await Question.create(questionFormattedIntoSchema);
  },

  async addAnswer(question_id, { body, name, email, photos }) {
    const maxAnswerId = await Answer
      .find({}, { answer_id: 1, _id: 0 })
      .sort({ answer_id: -1 })
      .limit(1);
    const newUniqueAnswerId = maxAnswerId[0].answer_id + 1;
    const answerFormattedIntoSchema = parseAnswer({
      question_id,
      id: newUniqueAnswerId,
      body,
      date_written: Date.now(),
      answerer_name: name,
      reported: false,
      helpful: 0,
      answerer_email: email,
      photos
    });
    await Answer.create(answerFormattedIntoSchema);
  },

  async incrementQuestionHelpfulness(question_id) {
    const queryResult = await Question.updateOne(
      { question_id },
      { $inc: { question_helpfulness: 1 }}
    );
    if (!queryResult.n) {
      throw new Error(`Could not use question_id: ${question_id} to incrementQuestionHelpfulness`);
    }
    if (!queryResult.nModified) {
      throw new Error(`Could not use question_id: ${question_id}) to incrementQuestionHelpfulness`);
    }
  },

  async markQuestionReported(question_id) {
    const queryResult = await Question.updateOne(
      { question_id },
      { $set: { reported: true }}
    );
    if (!queryResult.n) {
      throw new Error(`Could not use question_id: ${question_id} to markQuestionReported`);
    }
  },

  async incrementAnswerHelpfulness(answer_id) {
    const queryResult = await Answer.updateOne(
      { answer_id },
      { $inc : { answer_helpfulness: 1 }}
    );
    if (!queryResult.n) {
      throw new Error(`Could not use answer_id: ${answer_id} to incrementAnswerHelpfulness`);
    }
    if (!queryResult.nModified) {
      throw new Error(`Could not use answer_id: ${answer_id} to incrementAnswerHelpfulness` );
    }
  },

  async markAnswerReported(answer_id) {
    const queryResult = await Answer.updateOne(
      { answer_id },
      { $set: { reported: true }}
    );
    if (!queryResult.n) {
      throw new Error(`Could not report answer with ID: ${answer_id} because it does not exist`);
    }
  }
};
