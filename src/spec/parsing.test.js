const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const parseAnswer = require('../csvParse/parseAnswer.js');
const parsePhoto = require('../csvParse/parsePhoto.js');
const parseQuestion = require('../csvParse/parseQuestion.js');

describe('Parsing Functions', () => {

  describe('parseQuestion', () => {
    let question;

    beforeAll(() => {
      question = parseQuestion({
        id: '1',
        product_id: '1',
        body: 'what fabric is the top made of?',
        date_written: '1595884714409',
        asker_name: 'yankeelover',
        asker_email: 'first.last@gmail.com',
        reported: '0',
        helpful: '1'
      });
    });

    test('should output the question_id as a Number when given a Number as a string', () => {
      expect(question).toHaveProperty('question_id', 1);
      expect(typeof question['question_id']).toBe('number');
    });

    test('should output an empty object when given a falsy id value', () => {
      const result = parseQuestion({
        id: null,
        product_id: '1',
        body: 'what fabric is the top made of?',
        date_written: '1595884714409',
        asker_name: 'yankeelover',
        asker_email: 'first.last@gmail.com',
        reported: '0',
        helpful: '1'
      });
      expect(result).toEqual({});
    });

    test('should output product_id as a String when given a String number', () => {
      expect(question).toHaveProperty('product_id', '1');
      expect(typeof question['product_id']).toBe('string');
    });

    test('should output an empty object when given a falsy value as a product_id', () => {
      const result = parseQuestion({
        id: '1',
        product_id: null,
        body: 'what fabric is the top made of?',
        date_written: '1595884714409',
        asker_name: 'yankeelover',
        asker_email: 'first.last@gmail.com',
        reported: '0',
        helpful: '1'
      });
      expect(result).toEqual({});
    });

    test('should output asker_name as a String when given a String', () => {
      expect(question).toHaveProperty('asker_name', 'yankeelover');
      expect(typeof question['asker_name']).toBe('string');
    });

    test('should output question_body as String when given a String', () => {
      expect(question).toHaveProperty('question_body', 'what fabric is the top made of?');
      expect(typeof question['question_body']).toBe('string');
    });

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

    test('should output question_date in Date format', () => {
      expect(question).toHaveProperty('question_date');
      expect(typeof question['question_date']).toBe('string');
      expect(question.question_date).toBe('2020-07-27T16:18:34-05:00');
    });

    test('should output current date if given invalid date_written as input', () => {
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
      expect(typeof result['question_date']).toBe('string');
    });

    test('should output asker_email as a String when given a String', () => {
      expect(question).toHaveProperty('asker_email', 'first.last@gmail.com');
      expect(typeof question.asker_email).toBe('string');
    });

    test('should output an empty String for asker_email when given an empty string', () => {
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
      expect(result['asker_email']).toBeFalsy();
    });

    test('should output reported as a Boolean', () => {
      expect(question).toHaveProperty('reported');
      expect(typeof question.reported).toBe('boolean');
    });

    test('should output question_helpfulness as an Integer', () => {
      expect(question).toHaveProperty('question_helpfulness', 1);
      expect(typeof question['question_helpfulness']).toBe('number');
    });

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

    test('should output reported as false when given a falsy value', () => {
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
    beforeAll(() => {
      answer = parseAnswer({
        id: '420133',
        question_id: '215203',
        body: 'Quia expedita repellat.',
        date_written: '1616129260252',
        answerer_name: 'Enola_Streich92',
        answerer_email: 'Damion.Hartmann@gmail.com',
        reported: '0',
        helpful: '4'
      });
    });

    test('should output answer_id as an Integer when given a String number', () => {
      expect(answer).toHaveProperty('answer_id', 420133);
      expect(typeof answer['answer_id']).toBe('number');
    });

    test('should output an empty object when given a falsy id value', () => {
      const result = parseAnswer({
        id: null,
        question_id: '215203',
        body: 'Quia expedita repellat.',
        date_written: '1616129260252',
        answerer_name: 'Enola_Streich92',
        answerer_email: 'Damion.Hartmann@gmail.com',
        reported: '0',
        helpful: '4'
      });
      expect(result).toEqual({});
    });

    test('should output an empty object when given a falsy question_id value', () => {
      const result = parseAnswer({
        id: '420133',
        question_id: null,
        body: 'Quia expedita repellat.',
        date_written: '1616129260252',
        answerer_name: 'Enola_Streich92',
        answerer_email: 'Damion.Hartmann@gmail.com',
        reported: '0',
        helpful: '4'
      });
      expect(result).toEqual({});
    });

    test('should output parent_question_id as an Integer when given a number as a String', () => {
      expect(answer).toHaveProperty('parent_question_id', 215203);
      expect(typeof answer['parent_question_id']).toBe('number');
    });

    test('should output answer_body as a String when given a String', () => {
      expect(answer).toHaveProperty('answer_body', 'Quia expedita repellat.');
      expect(typeof answer['answer_body']).toBe('string');
    });

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

    test('should output answer_date as a Date', () => {
      expect(answer).toHaveProperty('answer_date');
      expect(typeof answer['answer_date']).toBe('string');
    });

    test('should output answerer_name as a String when given a String', () => {
      expect(answer).toHaveProperty('answerer_name', 'Enola_Streich92');
      expect(typeof answer['answerer_name']).toBe('string');
    });

    test('should output reported as a Boolean', () => {
      expect(answer).toHaveProperty('reported');
      expect(typeof answer.reported).toBe('boolean');
    });

    test('should output answer_helpfulness as an Integer', () => {
      expect(answer).toHaveProperty('answer_helpfulness', 4);
      expect(typeof answer['answer_helpfulness']).toBe('number');
    });

    test('should output photos as an Array', () => {
      expect(answer).toHaveProperty('photos');
      expect(Array.isArray(answer.photos)).toBe(true);
      expect(answer.photos.length).toBe(0);
    });

    test('should output an empty object if given a an empty String', () => {
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

    test('should output User for answerer_name if given no answerer_name', () => {
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

    test('should output reported as false when given an empty string', () => {
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
      expect(answer).toHaveProperty('answerer_email', 'Damion.Hartmann@gmail.com');
    });

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
      expect(typeof result['answer_date']).toBe('string');
    });

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
    beforeAll(() => {
      photo = parsePhoto({
        id: '1',
        answer_id: '5',
        url: "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
      });
    });

    test('should output photo_id as an Integer', () => {
      expect(photo).toHaveProperty('photo_id', 1);
    });

    test('should output an empty object when given a falsy photo_id', () => {
      const result = parsePhoto({
        photo_id: '1',
        answer_id: null,
        url: "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
      });
      expect(result).toEqual({});
    });

    test('should output an empty object when given a falsy photo_id', () => {
      const result = parsePhoto({
        photo_id: null,
        answer_id: '1',
        url: "https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
      });
      expect(result).toEqual({});
    });

    test('should output an answer_id as a Number', () => {
      expect(photo).toHaveProperty('answer_id', 5);
    });

    test('should output a url as a String', () => {
      expect(photo).toHaveProperty('url');
      expect(typeof photo.url).toBe('string');
    });

    test('should output an empty object when given a falsy url', () => {
      const result = parsePhoto({
        id: '1',
        answer_id: '5',
        url: null
      });
      expect(result).toEqual({});
    });
  });
});
