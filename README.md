# QuestAPI
QuestAPI is a REST API that provides Question and Answers data to the Atelier E-Commerce platform.

QuestAPI provides an automatic Extract, Transform and Load process for the required CSV data, which populates a Mongo instance without any need for manual user interaction. 

That process, combined with tests covering 77% of the code base, and a simple straightforward API that interacts with Mongo and Redis instances which are containerized with Docker, means that the service is easily scalable both vertically and horizontally in the future.

Accessible and deplyed on a single AWS EC2 T2 micro (8 GiB) at: **52.15.73.97**

<img src=https://img.shields.io/badge/Code%20Coverage-77%25-yellowgreen/> 

<img src="https://img.shields.io/badge/Runtime-Node.js-%23429643?logo=node.js"/> <img src="https://img.shields.io/badge/Database-MongoDB-%23429643?logo=mongodb"/> <img src="https://img.shields.io/badge/Caching-Redis-red?logo=redis"/> 

<img src="https://img.shields.io/badge/Deployment-AWS%20EC2-%23EC912D?logo=amazon"/> <img src="https://img.shields.io/badge/Development-Docker-9cf?logo=docker"/> <img src="https://img.shields.io/badge/Testing-Jest-%23C2A812?logo=jest"/> <img src="https://img.shields.io/badge/Testing-SuperTest-important"/> <img src="https://img.shields.io/badge/Testing-Loader.io-%231A82E3?"/>

---

## Table of Contents
1. [Automated Extract, Transform, and Load Process](#Automated-Extract-Transform-and-Load-Process)
    * [Initializing The Database](#initializing-the-database-connectionjs)
    * [Initializing Function](#initializing-function-initjs) 
    * [Populating The DB](#Populating-The-DB-populateDBjs)
    * [ETL Duration](#ETL-Duration)
3. [API Performance](#API-Performance)
4. [Data Flow](#Data-Flow)
5. [Endpoints](#Endpoints)


# Automated Extract, Transform, and Load Process
QuestAPI includes an automated ETL process built-in.
It uses the Node.js Fs module as well as the Mongoose ODM to populate a Mongo database.

1. ### Initializing The Database <connection.js>
On initilization, QuestAPI will check the current connected Mongo instance for the required data, and invoke init() if it does not contain it.
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
2. ### Initializing Function <init.js>
Once it is verified that the data is not within the database, Init() is invoked, starting the ETL process.
```node
const path = require('path');
const populateDB = require('../csvParse/populateDB.js');
const parseQuestion = require('../csvParse/parseQuestion.js');

const init = () => {
  populateDB.insertQuestions(path.join(__dirname, '../data/questions.csv'), parseQuestion);
}
```
3. ### Populating The DB <populateDB.js>
This is first function of the ETL chain, but the next two functions follow the same pattern as this one.

*PATTERN* :
1. Extract data from the CSV file using a readStream
2. Transform the data to fit the Mongoose Schema
3. Load the data into Mongo with Mongoose Queries
4. Repeat

* **IMPORTANT** : This implementation only moves as fast as Mongoose Queries can resolve, but it works within the constraints of the V8 engine's memory heap.

* Each chunk received from the stream is about 530 rows from the CSV.
* Each function also invokes timer() which is a HoF. The resulting function is invoked again at the end of the process, giving us the function duration.
* For the transformations, we abstract that logic into separate functions that return the objects to be used by the Mongoose Query.
* A log is also scheduled every 1000 queries for human sanity checks.
* This implementation ignores insertion errors and continues on with { ordered: false }

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
4. ### ETL Duration

Since this ETL process relies on the speed of Mongoose Queries resolving, optimizations are focused on the readStream and chunk-size to Query-speed comparisons.

This process clocked in at an average of 45 minutes (with a fastest completion time of 30 minutes, and a slowest completion of 60 minutes).
This process was run on over 12 million rows of CSV data.
The times are taken from 7 iterations of this ETL process.

---
  

# API Performance

*LAST UPDATED* : 05/15/2021

*FUTURE OPTIMIZATION* : Horizontal scaling and load-balancing. This is easily accompishable with the arcitecture of the service being containerized.

The most significant optimization implemented after deployment was the addition of a Redis cache that operated with short expiration timers. I decided this in order to cache the most popular products. On page load, the Questions route would be the route that has a 100% chance of being called. Since this was the case, I wanted to focus on optimizing the most products that were the most popular, handling strong upticks in traffic.

The results of the tests indicate that that was successful, but now we need to scale horizontally in order to handle varied requests.

**all stress tests done with Loader.io on an AWS EC2 T2 Micro Instance**

The most expensive route is to GET a question since it must also be populated with all of a single product's questions and answers, denormalized.


These next two results are for repeated requests against the Questions at 500 clients per second.
> Prior to Redis optimization
![image](https://user-images.githubusercontent.com/74506521/118375111-3afeff80-b585-11eb-8d0c-9771e85d9d08.png)
> After Redis optimization
![image](https://user-images.githubusercontent.com/74506521/118374946-279f6480-b584-11eb-9c05-5914b8f791b8.png)

As you can see, adding Redis caching decreased the response time to 2% of its original and in increase to 100% successful responses instead of the previous 21% success rate.

--

These next two results are for repeated requests against the Answer endpoint at 750 clients per second.
> Prior to Redis optimization
![image](https://user-images.githubusercontent.com/74506521/118375319-a3021580-b586-11eb-9557-4796f872b602.png)
> After Redis optimization
![image](https://user-images.githubusercontent.com/74506521/118375364-d17ff080-b586-11eb-8846-733b0f2d1714.png)

The post-Redis optimized results show that we have a response time 1% of the original and nearly 100% of the possible successful repsonses completed.
  
---
  
# Data Flow
1. Database Initializes with data
2. Client sends GET request
3. Server checks Redis cache which operates off of LRU timers
4. If the requested information is within the Redis cache, return response to the Client
5. If the requested information is not within the Redis cache, Query the Database
6. Once the request returns from Mongo, add it to the Redis cache with an expiration timer
7. Return the response to the Client

![image](https://user-images.githubusercontent.com/74506521/118369317-b4d4c000-b568-11eb-92bc-f8d63fc537f9.png)

---

# Endpoints
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
