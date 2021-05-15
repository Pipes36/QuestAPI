# QuestAPI
QuestAPI is a REST API that provides Question and Answers data to the Atelier E-Commerce platform.

Accessible and deplyed on AWS at: **52.15.73.97**

<img src=https://img.shields.io/badge/Code%20Coverage-77%25-yellowgreen/> 

<img src="https://img.shields.io/badge/Runtime-Node.js-%23429643?logo=node.js"/> <img src="https://img.shields.io/badge/Database-MongoDB-%23429643?logo=mongodb"/> <img src="https://img.shields.io/badge/Caching-Redis-red?logo=redis"/> 

<img src="https://img.shields.io/badge/Deployment-AWS%20EC2-%23EC912D?logo=amazon"/> <img src="https://img.shields.io/badge/Development-Docker-9cf?logo=docker"/> <img src="https://img.shields.io/badge/Testing-Jest-%23C2A812?logo=jest"/> <img src="https://img.shields.io/badge/Testing-SuperTest-important"/> <img src="https://img.shields.io/badge/Testing-Loader.io-%231A82E3?"/>

---

## Table of Contents
1. [Extract, Transform, Load](#Extract-Transform-Load)
2. [Data Flow](#Data-Flow)
3. [Endpoints](#Endpoints)


# Extract, Transform, Load
QuestAPI includes an automated ETL process built-in.
It uses the Node.js Fs module as well as the Mongoose ODM to populate a Mongo database.

1. #### Database Init (./db/connection.js)
On initilization, QuestAPI will automatically begin the ETL process if data does not exist in Mongo.
```node
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.promise = Promise;

const db = (async () => {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log('Successfully Connected to DB'
    const connection = mongoose.connection;
    const collectionSearch = await connection.db.listCollections().toArray();
      if (isEmpty(collectionSearch)) {
       console.log('Initializing DB with Data');
       init();
      }
    return connection;
  } catch(err) {
    console.log(err);
    console.log('Error connecting to DB');
  }
})();
```
2. #### Init Function (./db/init.js)
If the data does not exist in the DB, init() will begin the ETL process.
```node
const path = require('path');
const populateDB = require('../csvParse/populateDB.js');
const parseQuestion = require('../csvParse/parseQuestion.js');

const init = () => {
  populateDB.insertQuestions(path.join(__dirname, '../data/questions.csv'), parseQuestion);
}
```
3. #### Populating the DB (./csvParse/populateDb.js) { insertQuestions }
This is first function of the ETL chain, but the next two functions follow the same pattern as this one.
Within each function, the data is pulled from the CSV files, parsed, transformed to match the database Schema, and then loaded into Mongo. Each function also includes a timer that logs at the end of the process. 

```node
{
  insertQuestions: async (filePath, transformer) => {
    const startTime = timer();
    console.log('STEP 1/3: INSERT QUESTIONS')
    let firstLineRead = false;
    let columns = '';
    let iteration = 0;
    const questionReadStream = fs.createReadStream(filePath, {encoding: 'utf8'});

    questionReadStream.on('data', async (res) => {

      questionReadStream.pause();
      let docs = [];

      if (!firstLineRead) {
        columns = determineColumns(res);
        docs = transformRowsIntoObjects('', res, transformer);
        firstLineRead = true;
      } else {
        docs = transformRowsIntoObjects(columns, res, transformer);
      }
      try {
        const insertionQuery = await Question.insertMany(docs, { ordered: false });
        if (++iteration % 1000 === 0) console.log(`Questions Iteration Count: ${iteration}`);
      } catch (err) {
        console.log('Insertion Error: continuing { ordered: false }');
      }
      
      questionReadStream.resume();
      
    });
    questionReadStream.on('error', (err) => {
      console.log(err);
    });
    questionReadStream.on('end', () => {
      console.log(`INSERT QUESTIONS ENDING. TIME ELAPSED: ${startTime()}`)
      populateDB.insertAnswers(path.join(__dirname, '../data/answers.csv'), parseAnswer) // Continue Population
    });
  },
}
```
4. #### ETL Stats
The ETL process averages at 45 minutes for over 12 million rows of CSV. 
It has a fastest time of 30 minutes, and a slowest of 60.
The process works within the Memory constraints of the V8 engine.

  ---
  
## Data Flow
1. Database Initializes with data
2. Client sends GET request
3. Server checks Redis cache which operates off of LRU timers
4. If the requested information is within the Redis cache, return response to the Client
5. If the requested information is not within the Redis cache, Query the Database
6. Once the request returns from Mongo, add it to the Redis cache with an expiration timer
7. Return the response to the Client

![image](https://user-images.githubusercontent.com/74506521/118369317-b4d4c000-b568-11eb-92bc-f8d63fc537f9.png)

---

## Endpoints
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
