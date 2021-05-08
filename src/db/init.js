"use strict"
const populateDB = require('../csvParse/populateDB.js');
const path = require('path');
const parseQuestion = require('../csvParse/parseQuestion.js');

// ------------------------------------------------------- //
// ------------------------------------------------------- //
// ------------------------------------------------------- //
//  INIT IGNITES A CHAIN TO POPULATE THE ENTIRE DB ------- //
// ------------------------------------------------------- //
// ------------------------------------------------------- //
const init = () => {
  populateDB.insertQuestions(path.join(__dirname, '../data/questions.csv'), parseQuestion);
}

module.exports = init;
