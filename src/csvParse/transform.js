module.exports = {
  questionID: (id = '') => {
    if (!id) {
      throw new Error('No ID Provided. Cannot create question_id');
    }
    return Number(id);
  },
  productID: (id = '') => {
    if (!id) {
      throw new Error('No ID Provided. Cannot create product_id');
    }
    return id;
  },
  questionBody: (body = '') => {
    if (!body) {
      return {};
    }
    return body;
  },
  questionDate: (date) => {
    date = !date ? new Date() : date;
    return new Date (Date(date));
  },
  askerName: (name = 'User') => {
    if (!name) {
      return 'User';
    }
    return name;
  },
  askerEmail: (email) => {
    if (!email) {
      return '';
    }
    return email;
  },
  reported: (report) => {
    if (report === '1') {
      return true;
    }
    return false;
  },
  questionHelpfulness: (score = 0) => {
    return Number(score);
  },
  // ANSWERS -----------------------------------
  answerID: () => {
    // could consolidate into an ID method
  },
  answerBody: () => {
    // could consolidate questionBody
  },
  answerDate: () => {
    // Could consolidate questionDate
  },
  answererName: () => {
    // could consolidate into asker_name
  },
  answererEmail: () => {
    // could consolidate into askerEmail
  },
  reported: () => {
    // could consolidate into reported
  },
  answerHelpfulness: () => {
    // could be consolidated into querstionHelpfulness
  },
  photos: () => {

  }
}