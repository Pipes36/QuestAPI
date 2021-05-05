const parseAnswer = (answer = {}) => {
  // id becomes the id within the answers obj INTEGER
  // id also becomes answer_id => string => INTEGER
  // question_id needs string => INTEGER for lookup and question_id comparison
  // body becomes answer_body STRING
  // date_written becomes answer_date string => Date
  // answerer_name STRING
  // answerer_email but can be STRING
  // reported STRING 0||1||null => BOOLEAN
  // helpful becomes answer_helpfulness string => INTEGER
  // photos will be empty []
}

module.exports = parseAnswer;
