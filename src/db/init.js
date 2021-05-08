"use strict"
const populateDB = require('../csvParse/populateDB.js');
const path = require('path');
const parseQuestion = require('../csvParse/parseQuestion.js');
const parsePhoto = require('../csvParse/parsePhoto.js');

// ------------------------------------------------------- //
// ------------------------------------------------------- //
// ------------------------------------------------------- //
//  INIT IGNITES A CHAIN TO POPULATE THE ENTIRE DB ------- //
// ------------------------------------------------------- //
// ------------------------------------------------------- //
const init = () => {
  // populateDB.insertQuestions(path.join(__dirname, '../data/questions.csv'), parseQuestion);
  populateDB.insertPhotos(path.join(__dirname, '../data/answers_photos.csv'), parsePhoto)
}

module.exports = init;
