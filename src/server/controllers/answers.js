


module.exports = {
  fetchAnswers: async (req, res) => {
    res.send('Question GET to get answers works');
  },
  createAnswer: async (req, res) => {
    res.status(201).send('Question POST to add answer works');
  },
  updateAnswerHelpfulness: async (req, res) => {
    res.status(204).send('PUT route to answers works for marking as helpful');
  },
  reportAnswer: async (req, res) => {
    res.status(204).send('PUT route to answers works for marking as reported');
  }
}