const databaseName = 'TestQuest';
const db = require('./setupTests');
const app = require('../server/server');
const { Question, Answer } = require('../db/model/schema.js');

const request = require('supertest')(app);

describe('Endpoints', () => {

  db.setupDB(databaseName);

  test('GET /api/qa/questions should return a question based off of the sent product_id', async (done) => {
    await Answer.create({
      answer_id: 250000,
      parent_question_id: 1,
      answer_body: 'Insertion test',
      answer_date: '2011-10-05T14:48:00.000Z',
      answerer_name: `John Smith`,
      reported: false,
      answer_helpfulness: 3,
      answerer_email: 'wild@email.com',
      photos: []
    });

    const res = await request.get('/api/qa/questions').set('product_id', '1');
    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].answers['250000'].answer_id).toBe(250000);
    expect(res.body.results[0].answers['2'].answer_id).toBe(2);
    done();
  });

  test('GET /api/qa/questions/:question_id/answers should return the answers to a question based off the requested question_id', async (done) => {
    const res = await request.get('/api/qa/questions/1/answers');

    expect(res.statusCode).toBe(200);
    expect(res.body.question).toBe('1');
    expect(res.body.page).toBe(0); // Default
    expect(res.body.count).toBe(5); // Default
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0].answer_id).toBe(2);
    expect(res.body.results[0].parent_question_id).toBeFalsy();
    expect(res.body.results[1].answer_id).toBe(250000);
    expect(res.body.results[1].parent_question_id).toBeFalsy();
    done();
  });

  test('POST /api/qa/questions should add a Question to the DB', async (done) => {
    const res = await request.post('/api/qa/questions')
      .send({ product_id: '25' })
      .send({ body: 'Can ya believe this was added?!' })
      .send({ name: 'BigBoi' })
      .send({ email: 'email@email.com' });

    expect(res.status).toBe(201);
    const dbSearch = await Question.findOne({ question_id: 6 });
    expect(dbSearch.product_id).toBe('25');
    expect(dbSearch.question_body).toBe('Can ya believe this was added?!');
    expect(dbSearch.asker_name).toBe('BigBoi');
    expect(dbSearch.asker_email).toBe('email@email.com');
    expect(typeof dbSearch.question_date).toBe('string');
    expect(dbSearch.question_helpfulness).toBe(0);
    expect(dbSearch.reported).toBe(false);
    done();
  });

  test('POST /api/qa/questions/:question_id/answers should add an Answer to the DB', async (done) => {
    const res = await request.post('/api/qa/questions/30/answers')
      .send({ body: 'Hey I have an answer to your question!'})
      .send({ name: 'I\'m a question asker' })
      .send({ email: 'answer@email.com' })
      .send({ photos: [ 'url1', 'url2' ]});

    expect(res.status).toBe(201);
    const dbSearch = await Answer.findOne({ answer_id: 250001 });
    expect(dbSearch.photos).toHaveLength(2);
    expect(dbSearch.parent_question_id).toBe(30);
    expect(dbSearch.answer_body).toBe('Hey I have an answer to your question!');
    expect(dbSearch.answerer_name).toBe('I\'m a question asker');
    expect(dbSearch.reported).toBe(false);
    expect(dbSearch.answer_helpfulness).toBe(0);
    expect(dbSearch.answerer_email).toBe('answer@email.com');
    expect(typeof dbSearch.answer_date).toBe('string');
    done();
  });

  test('PUT /api/qa/questions/:question_id/helpful should increment the question_helpfulness of the Question matching the question_id', async (done) => {
    const initialValue = await Question.findOne({ question_id: 1 });
    expect(initialValue.question_helpfulness).toBe(3);
    const res = await request.put('/api/qa/questions/1/helpful');
    expect(res.status).toBe(204);
    const dbSearch = await Question.findOne({ question_id: 1 });
    expect(dbSearch.question_helpfulness).toBe(4);
    done();
  });

  test('PUT /api/qa/questions/:question_id/report should report the Question matching the question_id', async (done) => {
    const initialValue = await Question.findOne({ question_id: 1});
    expect(initialValue.reported).toBe(false);
    const res = await request.put('/api/qa/questions/1/report');
    expect(res.status).toBe(204);
    const dbSearch = await Question.findOne({ question_id: 1 });
    expect(dbSearch.reported).toBe(true);
    expect(dbSearch.asker_email).toBe('example@email.com');
    done();
  });

  test('PUT /api/qa/answers/:answer_id/helpful should increment the answer_helpfulness of the Answer matching the answer_id', async (done) => {
    const initialValue = await Answer.findOne({ answer_id: 2});
    expect(initialValue.answer_helpfulness).toBe(2);
    const res = await request.put('/api/qa/answers/2/helpful');
    expect(res.status).toBe(204);
    const dbSearch = await Answer.findOne({ answer_id: 2 });
    expect(dbSearch.answer_helpfulness).toBe(3);
    expect(dbSearch.answer_body).toBe('This is a test insertion for the Answer Collection');
    expect(dbSearch.reported).toBe(false);
    done();
  });

  test('PUT /api/qa/answers/:answer_id/report should report the Answer matching the answer_id', async (done) => {
    const initialValue = await Answer.findOne({ answer_id: 2});
    expect(initialValue.reported).toBe(false);
    const res = await request.put('/api/qa/answers/2/report');
    expect(res.status).toBe(204);
    const dbSearch = await Answer.findOne({ answer_id: 2 });
    expect(dbSearch.reported).toBe(true);
    expect(dbSearch.answer_date).toBe('2011-10-05T14:48:00.000Z');
    expect(dbSearch.answerer_name).toBe('Test User2');
    done();
  });
});
