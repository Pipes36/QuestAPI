# QuestAPI
QuestAPI is the service that provides Question and Answers data to the Atelier E-Commerce platform.

# Built With
  - [Node.js](https://nodejs.org/en/)
  - [Bluebird](http://bluebirdjs.com/docs/getting-started.html)
  - [Compression](http://expressjs.com/en/resources/middleware/compression.html)
  - [cors](https://expressjs.com/en/resources/middleware/cors.html)
  - [csv-parse](https://www.npmjs.com/package/csv-parse)
  - [Express](https://expressjs.com/)
  - [Lodash](https://lodash.com/)
  - [Moment.js](https://momentjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [Morgan](https://www.npmjs.com/package/morgan)
  - [Redis](https://redis.io/)
  - [SuperAgent](https://visionmedia.github.io/superagent/)
  - [Yarn](https://yarnpkg.com/)
  - [Docker](https://www.docker.com/)
  - [AWS EC2](https://aws.amazon.com/)
  - [Loader.io](https://loader.io/)
  - [Jest](https://jestjs.io/)
  - [SuperTest](https://www.npmjs.com/package/supertest)

## API Routes / Usage
**All example requests are made with SuperAgent**

### GET 52.15.73.97/api/qa/questions
Retrieves a list of questions for the requested product, not including reported questions.

Header | Type | Description
-------|------|------------
product_id | String | Specifies the product for which to receive questions

```node
const res = await request.get('/api/qa/questions').set('product_id', '1');
```
> Response: Status 200 OK
```json
{
    "product_id": "1",
    "results": [
        {
            "_id": "609bec05262cc03dd6ef9ce7",
            "question_id": 1,
            "product_id": "1",
            "question_body": "What fabric is the top made of?",
            "question_date": "2020-07-27T16:18:34-05:00",
            "asker_name": "yankeelover",
            "asker_email": "first.last@gmail.com",
            "reported": false,
            "question_helpfulness": 1,
            "__v": 0,
            "answers": {
                "5": {
                    "photos": [
                        {
                            "photo_id": 1,
                            "url": "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
                        }
                    ],
                    "answer_id": 5,
                    "answer_body": "Something pretty soft but I can't be sure",
                    "answer_date": "2020-09-13T04:49:20-05:00",
                    "answerer_name": "metslover",
                    "reported": false,
                    "answer_helpfulness": 5,
                    "answerer_email": "first.last@gmail.com",
                    "__v": 0
                },
                "7": {
                    "photos": [],
                    "answer_id": 7,
                    "answer_body": "Its the best! Seriously magic fabric",
                    "answer_date": "2021-02-27T12:45:24-06:00",
                    "answerer_name": "metslover",
                    "reported": false,
                    "answer_helpfulness": 7,
                    "answerer_email": "first.last@gmail.com",
                    "__v": 0
                },
                "8": {
                    "photos": [],
                    "answer_id": 8,
                    "answer_body": "DONT BUY IT! It's bad for the environment",
                    "answer_date": "2020-09-19T16:49:22-05:00",
                    "answerer_name": "metslover",
                    "reported": false,
                    "answer_helpfulness": 8,
                    "answerer_email": "first.last@gmail.com",
                    "__v": 0
                },
            }
        }
    ]
}
```
---
### GET 52.15.73.97/api/qa/questions/:question_id/answers
Returns answers for a given question, not including reported answers.

Parameter | Type | Description
-------|------|------------
question_id | Integer | Specifies the product for which to receive answers

```node
const res = await request.get('/api/qa/questions/1/answers');
```
> Response: Status 200 OK
```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
      {
          "photos": [
              {
                  "photo_id": 1,
                  "url": "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
              },
              {
                  "photo_id": 2,
                  "url": "https://images.unsplash.com/photo-1511127088257-53ccfcc769fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
              },
              {
                  "photo_id": 3,
                  "url": "https://images.unsplash.com/photo-1500603720222-eb7a1f997356?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80"
              }
          ],
          "answer_id": 5,
          "answer_body": "Something pretty soft but I can't be sure",
          "answer_date": "2020-09-13T04:49:20-05:00",
          "answerer_name": "metslover",
          "reported": false,
          "answer_helpfulness": 5,
          "answerer_email": "first.last@gmail.com",
          "__v": 0
      },
      {
          "photos": [],
          "answer_id": 7,
          "answer_body": "Its the best! Seriously magic fabric",
          "answer_date": "2021-02-27T12:45:24-06:00",
          "answerer_name": "metslover",
          "reported": false,
          "answer_helpfulness": 7,
          "answerer_email": "first.last@gmail.com",
          "__v": 0
      },
  ]
}
```
---
### POST 52.15.73.97/api/qa/questions
Creates a question for the specified product.

Body Parameters
Parameter | Type | Description
-------|------|------------
body | String | Text of the question being asked
name | String | name of the question asker
email | String | Email address of the question asker
product_id | Integer | **Required**: ID of the product for which the question is submitted

```node
const res = await request.post('/api/qa/questions')
      .send({ product_id: '25' })
      .send({ body: 'Does this make me look hip?!' })
      .send({ name: 'CoolGuy221' })
      .send({ email: 'coolguy@email.com' });;
```
> Response: Status 201 Created

---
### POST 52.15.73.97/api/qa/questions/:question_id/answers
Creates an answer for the specified question.

Parameters
Parameter | Type | Description
-------|------|------------
question_id | Integer | **Required**: ID of the question being answered


Body Parameters
Parameter | Type | Description
-------|------|------------
body | String | Text of the question being askwer
name | String | name of the question asker
email | String | Email address of the question asker
photos | \[String\] | List of photo urls

```node
  const res = await request.post('/api/qa/questions/30/answers')
    .send({ body: 'Hey I have an answer to your question!'})
    .send({ name: 'I\'m a question asker' })
    .send({ email: 'answer@email.com' })
    .send({ photos: [ 'url1', 'url2' ]});
```
> Response: Status 201 Created

---
### PUT 52.15.73.97/api/qa/questions/:question_id/helpful
Adds to the helpfulness count of a specified question.

Parameter | Type | Description
-------|------|------------
question_id | Integer | **Required**: ID of the question being marked as helpful

```node
const res = await request.put('/api/qa/questions/1/helpful');
```
> Response: Status 204 No Content
---
### PUT 52.15.73.97/api/qa/questions/:question_id/report
Reports a question.

Parameter | Type | Description
-------|------|------------
question_id | Integer | **Required**: ID of the question being reported
```node
const res = await request.put('/api/qa/questions/1/report');
```
> Response: Status 204 No Content
---
### PUT 52.15.73.97/api/qa/answers/:answer_id/helpful
Adds to the helpfulness count of a specified answer.

Parameter | Type | Description
-------|------|------------
answer_id | Integer | **Required**: ID of the question being marked as helpful
```node
const res = await request.put('/api/qa/answers/2/helpful');
```
> Response: Status 204 No Content
---
### PUT 52.15.73.97/api/qa/answers/:answer_id/report
Reports an answer.

Parameter | Type | Description
-------|------|------------
answer_id | Integer | **Required**: ID of the question being reported
```node
const res = await request.put('/api/qa/answers/2/helpful');
```
> Response: Status 204 No Content
