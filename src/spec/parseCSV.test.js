const { parseCSV } = require('../csvParse/parseCSV.js');
const path = require('path');
const { testCSVResult, questionsResult, answersResult } = require('../dummyData');
const fs = require('fs');
const parse = require('csv-parse');

describe('Parsing CSV', () => {
  let testFilePath;
  beforeEach(() => {
    testFilePath = path.join(__dirname, '../dummyData/testCSV.csv');
  })
  describe('parseCSV', () => {
    it('should invoke the callback when given valid CSV', (done) => {
      const mock = jest.fn((err, results) => {
        try {
          expect(mock).toHaveBeenCalledTimes(1);
          done();
        } catch (err) {
          done(err);
        }
      });
      const callback = parse({}, mock)
      parseCSV(testFilePath, callback);
    })

    it('should parse valid CSV at a given path', (done) => {
      const callback = parse({ columns: true}, (err, results) => {
        try {
          expect(results).toBeInstanceOf(Array);
          expect(results).toEqual(testCSVResult);
          done();
        } catch (err) {
          done(err);
        }
      });
      parseCSV(testFilePath, callback);
    });
    it('should parse questions CSV', (done) => {
      const callback = parse({ columns: true}, (err, results) => {
        try {
          expect(results).toEqual(questionsResult);
          done();
        } catch (err) {
          done(err)
        }
      });
      parseCSV(path.join(__dirname, '../dummyData/questions.csv'), callback);
    });

    it('should parse answers CSV', (done) => {
      const callback = parse({ columns: true}, (err, results) => {
        try {
          expect(results).toEqual(answersResult);
          done();
        } catch (err) {
          done(err);
        }
      });
      parseCSV(path.join(__dirname, '../dummyData/answers.csv'), callback);
    });

    // it('should throw an error when given invalid CSV', (done) => {
    //   const callback = jest.fn((err, results) => {
    //     expect(err).toBeInstanceOf(Error);
    //     expect(callback).toThrow();
    //     done(err);
    //   })
    //   parseCSV(path.join(__dirname, '../dummyData/invalid.csv'), callback);
    // });
  });

})
