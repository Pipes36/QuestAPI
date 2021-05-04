const { parseCSV } = require('../csvParse/parseCSV.js');
const path = require('path');
const { testCSVResult, questionsResult, answersResult, singleTestCSVResult } = require('../dummyData');
const fs = require('fs');
const parse = require('csv-parse');

describe('Parsing CSV', () => {
  let testFilePath;
  beforeEach(() => {
    testFilePath = path.join(__dirname, '../dummyData');
  })
  describe('parseCSV', () => {
    it('should invoke the callback when given valid CSV', (done) => {
      const mock = jest.fn(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        done();
      });
      parseCSV(testFilePath + '/singleTestCSV.csv', mock);
    })

    it('one CSV line should become 1 object', async(done) => {
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

    it('should run multiple assertions for multiple CSV lines', (done) => {
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

    it('should trim whitespace in input CSV', (done) => {
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

    it('should throw an error for invalid lines CSV', (done) => {
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

    it('should skip empty lines', (done) => {
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

})
