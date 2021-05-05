const { parseCSV } = require('../csvParse/parseCSV.js');
const path = require('path');
const { testCSVResult, questionsResult, answersResult, singleTestCSVResult } = require('../dummyData');
const fs = require('fs');
const parse = require('csv-parse');
const parseAnswer = require('../csvParse/parseAnswer.js');
const parsePhoto = require('../csvParse/parsePhoto.js');

describe('Parsing CSV', () => {
  let testFilePath;
  beforeEach(() => {
    testFilePath = path.join(__dirname, '../dummyData');
  })
  describe('parseCSV', () => {

    test('should invoke the callback when given valid CSV', (done) => {
      const mock = jest.fn(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        done();
      });
      parseCSV(testFilePath + '/singleTestCSV.csv', mock);
    })

    test('one CSV line should become 1 object', async(done) => {
      const callback = (err, result) => {
        try {
          expect(result).toEqual(singleTestCSVResult);
          done();
        } catch (err) {
          done(err);
        }
      }
      parseCSV(testFilePath + '/singleTestCSV.csv', callback);
    });

    test('should run multiple assertions for multiple CSV lines', (done) => {
      expect.hasAssertions();
      const callback = jest.fn((err, result) => {
        try {
          expect(result).toBeInstanceOf(Object);
          done();
        } catch (err) {
          done(err);
        }
      });
      parseCSV(testFilePath + '/testCSV.csv', callback);
    });

    test('should trim whitespace in input CSV', (done) => {
      const callback = (err, result) => {
        try {
          expect(result).toEqual({
            id: '3',
            question_id: 'this is a question',
            date: 'monday'
          });
          done();
        } catch (err) {
          done(err);
        }
      }
      parseCSV(testFilePath + '/whitespace.csv', callback);
    });

    test('should throw an error for invalid lines CSV', (done) => {
      const callback = (err, result) => {
        try {
          expect(err).toBeInstanceOf(Error);
          done();
        } catch (err) {
          done(err);
        }
      }
      parseCSV(testFilePath + '/invalid.csv', callback)
    });

    test('should skip empty lines', (done) => {
      const callback = (err, result) => {
        try {
          expect(result).toEqual(singleTestCSVResult);
          done();
        } catch (err) {
          done(err);
        }
      }
      parseCSV(testFilePath + '/emptyLine.csv', callback);
    });
  });

  describe('parseCSV Load Testing', () => {

    test('should parse CSV of 100 rows', (done) => {
      const callback = (err, results) => {
        try {
          expect(results).toBeInstanceOf(Object);
          done();
        } catch (err) {
          done(err);
        }
      }
      parseCSV(testFilePath + '/answersMedium.csv', callback);
    });

    test('should parse CSV of 500 rows', (done) => {
      const callback = (err, result) => {
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('id');
        done();
      }
      parseCSV(testFilePath + '/answersLarge.csv', callback);
    });

    test('should parse CSV of 3000+ rows', (done) => {
      const callback = (err, result) => {
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('id');
        done();
      }
      parseCSV(testFilePath + '/answersXL.csv', callback);
    });

  });
});

describe('parseQuestion', () => {
  const parseQuestion;
  let question;

  before(() => {
    parseQuestion =  require('../csvParse/parseQuestion.js');
  });

  beforeEach(() => {
    question = {
      id: '1',
      product_id: '1',
      body: 'what fabric is the top made of?',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '1';
    }
  });

  test('should throw an error if it does not have an id', () => {
    expect(parseQuestion(Object.assign(question, { id: null }))).toThrow();
  });

  // Should change id into question_id

  test('should transform id from a string to an integer', () => {
    expect(parseQuestion(question)).toHaveProperty('question_id', 1);
  });

  // PROPERTIES TO EXIST
  // question_id must exist as Integer
  // product_id must exist as String but also a valid number
  // question_body must exist as String
  // asker_name must exist as String
  // question_date must exist as Date
  // reported must exist as Boolean
  // question_helpfulness must exist as Integer


  // when no body, returns an empty object

  // when given an empty asker_name, will turn into 'User'

  // should have reported, which when given nothing becomes false

  // reported when given a '1' becomes true

  // reported when given a '0' becomes false

  // question_helpfulness will be 0 when given nothing

  // question_helpfulness becomes an Integer when given a string representation

});

describe('parseAnswer', () => {

  // PROPERTIES TO EXIST
  // answer_id must exist as Integer (formerly id)
  // question_id must exist as Integer
  // answer_body must exist as String
  // answer_date must exist as Date
  // answerer_name must exist as String
  // answerer_email OPTIONAL
  // reported must exist as Boolean
  // answer_helpfulness must exist as Integer,
  // photos must exist as Array

  // when given no body, gives User in answer_body

  // when given no date, gives generic date?

  // when given no name, gives User

  // when given no email, gives ''

  // should have reported, which when given nothing becomes false

  // reported when given a '1' becomes true

  // reported when given a '0' becomes false

  // helpful becomes question_helpfulness

  // this will be 0 when given nothing

  // helpful becomes an Integer when given a string representation

});

describe('parsePhoto', () => {

  // id stays id but becomes an Integer

  // answer_id must exist as a valid number/string

  // if url does not exist or is nullish or is empty string it gives a stock url

  // url must exist as a String

});
