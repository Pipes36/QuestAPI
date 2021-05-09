const databaseName = 'TestQuest';
const db = require('./setupTests');
const app = require('../server/server');
const { Question, Answer } = require('../db/model/schema.js');

const request = require('supertest')(app);

xdescribe('Endpoints', () => {

  db.setupDB(databaseName);

  test('GET /api/qa/questions should return a question based off of the sent product_id', async (done) => {
    const res = await request.get('/api/qa/questions')
    .set('product_id', '1');
    expect(res.status).toBe(200);
    expect(res.body.product_id).toBe('1');
    expect(res.body.question_id).toBeDefined();
    expect(res.body.question_body).toBe('This is a test insertion for the Question collection');
    expect(res.body.reported).toBe(false);
    done();
  });

  test('GET /api/qa/questions/:question_id/answers should return the answers to a question based off the requested question_id', async (done) => {
    const res = await request.get('/api/qa/questions/1/answers');
    expect(res.status).toBe(200);
    expect(res.body.answer_id).toBe(2);
    expect(res.body.parent_question_id).toBe(1);
    expect(res.body.photos).toBeDefined();
    expect(res.body.answer_body).toBe('This is a test insertion for the Answer Collection');
    done();
  });

  test('POST /api/qa/questions should add a Question to the DB', async (done) => {
    const res = await request.post('/api/qa/questions')
      .send({ product_id: '25' })
      .send({ body: 'Can ya believe this was added?!' })
      .send({ name: 'BigBoi' })
      .send({ email: 'email@email.com' });

    expect(res.status).toBe(201);
    const dbSearch = await Question.find({ product_id: '25' })
    console.log(dbSearch);
    done();
  });

  test('POST /api/qa/questions/:question_id/answers should add an Answer to the DB', async () => {
    const res = await request.post('/api/qa/questions/30/answers')
      .send({ body: 'Hey I have an answer to your question!'})
      .send({ name: 'I\'m a question asker' })
      .send({ email: 'answer@email.com' })
      .send({ photos: [ 'url1', 'url2' ]});

    expect(res.status).toBe(201);
    const dbSearch = await Question.find({ question_id: 30 });
    console.log(dbSearch);
    done();
  });

  test('PUT /api/qa/questions/:question_id/helpful should increment the question_helpfulness of the Question matching the question_id', async (done) => {
    const res = await request.put('/api/qa/questions/1/helpful');
    expect(res.status).toBe(204);
    const dbSearch = await Question.find({ question_id: 1 });
    console.log(dbSearch);
    expect(dbSearch.question_helpfulness).toBe(4);
    done();
  });

  test('PUT /api/qa/questions/:question_id/report should report the Question matching the question_id', async (done) => {
    const res = await request.put('/api/qa/questions/1/report');
    expect(res.status).toBe(204);
    const dbSearch = await Question.find({ question_id: 1 });
    console.log(dbSearch);
    expect(dbSearch.reported).toBe(true);
    done();
  });

  test('PUT /api/qa/answers/:answer_id/helpful should increment the answer_helpfulness of the Answer matching the answer_id', async () => {
    const res = await request.put('/api/qa/answers/:answer_id/helpful');
    expect(res.status).toBe(204);
    const dbSearch = await Answer.find({ answer_id: 2 });
    console.log(dbSearch);
    expect(dbSearch.answer_id).toBe(3);
    done();
  });

  test('PUT /api/qa/answers/:answer_id/report should report the Answer matching the answer_id', async () => {
    const res = await request.put('/api/qa/answers/2/report');
    expect(res.status).toBe(204);
    const dbSearch = await Answer.find({ answer_id: 2 });
    console.log(dbSearch);
    expect(dbSearch.reported).toBe(true);
    done();
  });
});
