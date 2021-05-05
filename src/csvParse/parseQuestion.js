const parseQuestion = (question = {}) => {
  // id STRING => INTEGER will become question_id
  // product_id STRING
  // body STRING will become question_body
  // date_written STRING||DATE => Date can be null? becomes question_date
  // asker_name STRING,
  // REPORTED STRING 0||1||null? => boolean,
  // helpful STRING => INTEGER, question_helpfulness
};

export default parseQuestion;
