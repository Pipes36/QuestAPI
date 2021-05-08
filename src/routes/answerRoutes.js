const router = require('express').Router();

router.put('/:answer_id/helpful', (req, res) => {
  res.status(204).send('PUT route to answers works for marking as helpful');
});

router.put('/:answer_id/report', (req, res) => {
  res.status(204).send('PUT route to answers works for marking as reported');
});

router.get('/', (req, res) => {
  res.send('answer route works')
});

module.exports = router;
