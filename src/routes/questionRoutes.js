const router= require('express').Router();

router.put('/:question_id/helpful', (req, res) => {
  res.status(204).send('Question PUT to mark as helpful works');
});

router.put('/:question_id/report', (req, res) => {
  res.status(204).send('Question PUT to mark as report');
});

router.get('/:question_id/answers', (req, res) => {
  res.send('Question GET to get answers works');
});

router.post('/:question_id/answers', (req, res) => {
  res.status(201).send('Question POST to add answer works');
});

router.post('/', (req, res) => {
  res.status(201).send('Question POST route works')
});

router.get('/', (req, res) => {
  res.send('Question GET route works');
});

module.exports = router;
