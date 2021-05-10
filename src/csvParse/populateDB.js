"use strict"
const fs = require('fs');
const path = require('path');
const { Question, Answer } = require('../db/model/schema.js');
const Promise = require('bluebird');
const { determineColumns, transformRowsIntoObjects } = require('./helpers.js');
const parseAnswer = require('./parseAnswer.js');
const parsePhoto = require('./parsePhoto.js');
const timer = require('./timer');

const populateDB = {
  // STEP 1
  insertQuestions: async (filePath, transformer) => {
    const startTime = timer(); // Note start time
    console.log('STEP 1/3: INSERT QUESTIONS') // DO NOT REMOVE
    let firstLineRead = false;
    let columns = '';
    let iteration = 0;
    const questionReadStream = fs.createReadStream(filePath, {encoding: 'utf8'});

    questionReadStream.on('data', async (res) => {
      //
      //  Ensure work takes place between pause() and resume()
      //
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
      //
      //  Ensure work takes place between pause() and resume()
      //
    });
    questionReadStream.on('error', (err) => {
      console.log(err);
    });
    questionReadStream.on('end', () => {
      console.log(`INSERT QUESTIONS ENDING. TIME ELAPSED: ${startTime()}`) // DO NOT REMOVE
      populateDB.insertAnswers(path.join(__dirname, '../data/answers.csv'), parseAnswer) // Continue Population
    });
  },
  // STEP 2
  insertAnswers: async (filePath, transformer) => {
    const startTime = timer(); // Note start time
    console.log('STEP 2/3: INSERT ANSWERS BEGINNING') // DO NOT REMOVE
    let firstLineRead = false;
    let columns = '';
    let iteration = 0;
    const answerReadStream = fs.createReadStream(filePath, {encoding: 'utf8'});

    answerReadStream.on('data', async (res) => {
      //
      //  Ensure work takes place between pause() and resume()
      //
      answerReadStream.pause();
      let docs = [];

      if (!firstLineRead) {
        columns = determineColumns(res) ;
        docs = transformRowsIntoObjects('', res, transformer);
        firstLineRead = true;
      } else {
        docs = transformRowsIntoObjects(columns, res, transformer);
      }

      try {
      // const resolvedAnswerQueries = await Question.bulkWrite(pendingAnswerQueries, { ordered: false })
        const answersQueries = Answer.insertMany(docs, { ordered: false });
        if (++iteration % 1000 === 0) console.log(`Answers Iteration Count: ${iteration}`);
      } catch (err) {
        console.log('Insertion Error: continuing { ordered: false }');
      }
      answerReadStream.resume();
      //
      //  Ensure work takes place between pause() and resume()
      //
    });
    answerReadStream.on('error', (err) => {
      console.log(err);
    });
    answerReadStream.on('end', () => {
      console.log(`INSERT ANSWERS ENDING. TIME ELAPSED: ${startTime()}`) // DO NOT REMOVE
      populateDB.insertPhotos(path.join(__dirname, '../data/answers_photos.csv'), parsePhoto); // Continue Population
    });
  },
  // STEP 3
  insertPhotos: async (filePath, transformer) => {
    const startTime = timer(); // Note start time
    console.log('STEP 3/3: INSERT PHOTOS BEGINNING.') // DO NOT REMOVE
    let firstLineRead = false;
    let columns = '';
    let iteration = 0;
    const photoReadStream = fs.createReadStream(filePath, {encoding: 'utf8'});

    photoReadStream.on('data', async (chunk) => {
      //
      //  Ensure work takes place between pause() and resume()
      //
      photoReadStream.pause();
      let docs = [];

      if (!firstLineRead) {
        columns = determineColumns(chunk);
        docs = transformRowsIntoObjects('', chunk, transformer);
        firstLineRead = true;
      } else {
        docs = transformRowsIntoObjects(columns, chunk, transformer);
      }

      const pendingPhotoQueries = docs.map(({ answer_id, photo_id, url }) => {
        return { updateOne: {
            filter : { answer_id: answer_id },
            update: {
              $push: { 'photos': { photo_id, url } }
            }
          }
        }
      });

      try {
        const resolvedPhotoQueries = await Answer.bulkWrite(pendingPhotoQueries, { ordered: false })
        if (++iteration % 1000 === 0) console.log(`Photos Iteration Count: ${iteration}`);
      } catch (err) {
        console.log('Insertion Error: continuing { ordered: false }');
      }
      photoReadStream.resume();
      //
      //  Ensure work takes place between pause() and resume()
      //
    });
    photoReadStream.on('error', (err) => {
      console.log(err);
    });
    photoReadStream.on('end', () => {
      console.log(`COMPLETE: DB Populated with Questions, Answers, and Photos. TIME ELAPSED: ${startTime()}`) // DO NOT REMOVE
    });
  }
};

module.exports = populateDB;
