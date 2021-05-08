const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(compression());
app.use(logger('tiny'));
// possibly express.raw
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = app;
