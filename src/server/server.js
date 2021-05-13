"use strict"
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const cors = require('cors');
const questionRoutes = require('./routes/questionRoutes.js');
const answerRoutes = require('./routes/answerRoutes.js');
const path = require('path');

const app = express();

app.use(cors());
app.use(compression());
app.use(logger('tiny'));
app.use(express.json());

app.use('/api/qa/questions', questionRoutes);
app.use('/api/qa/answers', answerRoutes)
app.use('/loaderio-cde861b3e94bf29551b3d94db6824984/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../loaderio-cde861b3e94bf29551b3d94db6824984.txt'));
});
app.use('/', (req, res, next) => {
  res.status(301).send('Resource not available at this address.');
});

module.exports = app;
