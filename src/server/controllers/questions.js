

module.exports = {
  fetchQuestion: async (req, res) => {
    // Add parsing for possible Page (default 1) and Count (default 5)
    // { $and: [ { product_id: '1' }, { reported: false } ]  } -- need photos for answers
    res.sendStatus(200);
  },
  createQuestion: async (req, res) => {
    res.status(201).send('Question POST route works')
  },
  updateQuestionHelpfulness: async (req, res) => {
    res.status(204).send('Question PUT to mark as helpful works');
  },
  reportQuestion: async (req, res) => {
    res.status(204).send('Question PUT to mark as report');
  }
}