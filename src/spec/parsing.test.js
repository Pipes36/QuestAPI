const { parseCSV } = require('../csvParse/parseCSV.js');
const path = require('path');
const { testCSVResult, questionsResult, answersResult, singleTestCSVResult } = require('../dummyData');
const fs = require('fs');
const parse = require('csv-parse');
const parseAnswer = require('../csvParse/parseAnswer.js');
const parsePhoto = require('../csvParse/parsePhoto.js');
const parseQuestion = require('../csvParse/parseQuestion.js');

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
  let question;

  beforeEach(() => {
    question = {
      id: '1',
      product_id: '1',
      body: 'what fabric is the top made of?',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '1'
    }

  });

  // PROPERTIES TO EXIST
  // question_id must exist as Integer
  test('should output question_id as an Integer', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('question_id', 1);
    expect(typeof result['question_id']).toBe('number');
  });

  // product_id must exist as String but also a valid number
  test('should output product_id property and an Integer', () => {
    expect(parseQuestion(question)).toHaveProperty('product_id', '1');
    const newCSV = {...question, 'product_id': '2223'};
    const newObj = parseQuestion(newCSV);
    expect(newObj).toHaveProperty('product_id', '2223');
    expect(typeof newObj['product_id']).toBe('string');
  });
  // asker_name must exist as String
  test('should output asker_name as String', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('asker_name', 'yankeelover');
    expect(typeof result['asker_name']).toBe('string');
  });
  // question_body must exist as String
  test('should output property question_body as String', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('question_body', 'what fabric is the top made of?');
    expect(typeof result['question_body']).toBe('string');
  });

  // question_date must exist as Date
  test('should output question_date in Date format', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('question_date');
    expect(result['question_date']).toBeInstanceOf(Date);
  });

  test('should output current date if given no date', () => {
    const result = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '1',
      helpful: '1'
    });
    expect(result['question_date']).toBeInstanceOf(Date);
  });

  test('should contain an asker_email property when given', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('asker_email', 'first.last@gmail.com')
  });

  test('should give empty string if given no asker_email', () => {
    const result = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '',
      asker_name: 'yankeelover',
      asker_email: '',
      reported: '1',
      helpful: '1'
    });
    expect(result).toHaveProperty('asker_email', '');
  });

  // reported must exist as Boolean
  test('should output reported as a Boolean', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('reported');
    expect(typeof result.reported).toBe('boolean');
  });
  // question_helpfulness must exist as Integer
  test('should output question_helpfulness as an Integer', () => {
    const result = parseQuestion(question);
    expect(result).toHaveProperty('question_helpfulness', 1);
    expect(typeof result['question_helpfulness']).toBe('number');
  });

  // when no body, returns an empty object
  test('should output an empty object if given no body', () => {
    const noBody = parseQuestion({
      id: '1',
      product_id: '1',
      body: '',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '1'
    });
    expect(noBody).toEqual({});
  });

  // when given an empty asker_name, will turn into 'User'
  test('should output User for asker_name if given no asker_name', () => {
    const noAskerName = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasdasd',
      date_written: '1595884714409',
      asker_name: '',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '1'
    });
    expect(noAskerName).toHaveProperty('asker_name', 'User');
  });

  // should have reported, which when given nothing becomes false
  test('should output reported as false when given no value', () => {
    const noReported = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '',
      helpful: '1'
    });
    expect(noReported).toHaveProperty('reported', false);
  });

  // reported when given a '1' becomes true
  test('should output reported as true when given 1', () => {
    const reportedOne = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '1',
      helpful: '1'
    });
    expect(reportedOne).toHaveProperty('reported', true);
  });

  // reported when given a '0' becomes false
  test('should output reported as false when given 0', () => {
    const reportedZero = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '1'
    });
    expect(reportedZero).toHaveProperty('reported', false);
  });

  // question_helpfulness will be 0 when given nothing
  test('should output question_helpfulness as a default of 0 when no value is given', () => {
    const noHelpful = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: ''
    });
    expect(noHelpful).toHaveProperty('question_helpfulness', 0);
  });

  // question_helpfulness becomes an Integer when given a string representation
  test('should output question_helpfulness as an Integer when given a value', () => {
    const helpful = parseQuestion({
      id: '1',
      product_id: '1',
      body: 'asdasdasd',
      date_written: '1595884714409',
      asker_name: 'yankeelover',
      asker_email: 'first.last@gmail.com',
      reported: '0',
      helpful: '22'
    });
    expect(helpful).toHaveProperty('question_helpfulness', 22);
    expect(typeof helpful['question_helpfulness']).toBe('number');
  });
});

describe('parseAnswer', () => {
  let answer;
  beforeEach(() => {
    answer = {
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '4'
    }
  });
  // PROPERTIES TO EXIST
  // answer_id must exist as Integer (formerly id)
  test('should output answer_id as an Integer', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answer_id', 420133);
    expect(typeof result['answer_id']).toBe('number');
  });
  // question_id must exist as Integer
  test('should output question_id as an Integer', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('question_id', 215203);
    expect(typeof result['question_id']).toBe('number');
  });
  // answer_body must exist as String
  test('should output answer_body as a String', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answer_body', 'Quia expedita repellat.');
    expect(typeof result['answer_body']).toBe('string');
  });
  // answer_date must exist as Date
  test('should output answer_date as a Date', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answer_date');
    expect(result['answer_date']).toBeInstanceOf(Date);
  });
  // answerer_name must exist as String
  test('should output answerer_name as a String', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answerer_name', 'Enola_Streich92');
    expect(typeof result['answerer_name']).toBe('string');
  });
  // answerer_email OPTIONAL
  // reported must exist as Boolean
  test('should output reported as a Boolean', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('reported');
    expect(typeof result.reported).toBe('boolean');
  });
  // answer_helpfulness must exist as Integer,
  test('should output answer_helpfulness as an Integer', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answer_helpfulness', 4);
    expect(typeof result['answer_helpfulness']).toBe('number');
  });
  // photos must exist as Array
  test('should output photos as an Array', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('photos');
    expect(Array.isArray(result.photos)).toBe(true);
    expect(result.photos.length).toBe(0);
  });
  // when given no body, gives User in answer_body  // when no body, returns an empty object
  test('should output an empty object if given no body', () => {
    const noBody = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: '',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '4'
    });
    expect(noBody).toEqual({});
  });

  // when given an empty asker_name, will turn into 'User'
  test('should output User for asker_name if given no answerer_name', () => {
    const noAnswererName = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: '',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '4'
    });
    expect(noAnswererName).toHaveProperty('answerer_name', 'User');
  });

  // should have reported, which when given nothing becomes false
  test('should output reported as false when given no value', () => {
    const noReported = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '',
      helpful: '4'
    });
    expect(noReported).toHaveProperty('reported', false);
  });

  // reported when given a '1' becomes true
  test('should output reported as true when given 1', () => {
    const reportedOne = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '1',
      helpful: '4'
    });
    expect(reportedOne).toHaveProperty('reported', true);
  });

  // reported when given a '0' becomes false
  test('should output reported as false when given 0', () => {
    const reportedZero = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '4'
    });
    expect(reportedZero).toHaveProperty('reported', false);
  });

  // question_helpfulness will be 0 when given nothing
  test('should output question_helpfulness as a default of 0 when no value is given', () => {
    const noHelpful = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: ''
    });
    expect(noHelpful).toHaveProperty('answer_helpfulness', 0);
  });

  // question_helpfulness becomes an Integer when given a string representation
  test('should output question_helpfulness as an Integer when given a value', () => {
    const helpful = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '22'
    });
    expect(helpful).toHaveProperty('answer_helpfulness', 22);
    expect(typeof helpful['answer_helpfulness']).toBe('number');
  });

  test('should output empty string if given no answerer_email', () => {
    const result = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '1616129260252',
      answerer_name: 'Enola_Streich92',
      answerer_email: '',
      reported: '0',
      helpful: '22'
    });
    expect(result).toHaveProperty('answerer_email');
  });

  test('should output email if given answerer_email', () => {
    const result = parseAnswer(answer);
    expect(result).toHaveProperty('answerer_email', 'Damion.Hartmann@gmail.com');
  })

  // when given no date, gives generic date?
  test('should output current date if given no date', () => {
    const result = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '',
      answerer_name: 'Enola_Streich92',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '22'
    });
    expect(result['answer_date']).toBeInstanceOf(Date);
  });

  // when given no name, gives User
  test('should output User when given no answerer_name', () => {
    const result = parseAnswer({
      id: '420133',
      question_id: '215203',
      body: 'Quia expedita repellat.',
      date_written: '',
      answerer_name: '',
      answerer_email: 'Damion.Hartmann@gmail.com',
      reported: '0',
      helpful: '22'
    });
    expect(result).toHaveProperty('answerer_name', 'User');
  });
});

describe('parsePhoto', () => {
  let photo;
  beforeEach(() => {
    photo = {
      id: '1',
      answer_id: '5',
      url: "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
    };
  });
  // id stays id but becomes an Integer
  test('should output id as an Integer', () => {
    const result = parsePhoto(photo);
    expect(result).toHaveProperty('id', 1);
  });
  // answer_id must exist as a valid number/string
  test('should output an answer_id as a String', () => {
    const result = parsePhoto(photo);
    expect(result).toHaveProperty('answer_id', 5);
  });
  // url must exist as a String
  test('should output a url as a String', () => {
    const result = parsePhoto(photo);
    expect(result).toHaveProperty('url');
    expect(typeof result.url).toBe('string');
  });

  test('should output url as Null if not given a string', () => {
    const result = parsePhoto({
      id: '1',
      answer_id: '5',
      url: ''
    });
    expect(result.url).toBe(null);
  });

});
