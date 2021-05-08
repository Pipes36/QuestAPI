"use strict"
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const cors = require('cors');
const questionRoutes = require('../routes/questionRoutes.js');
const answerRoutes = require('../routes/answerRoutes.js');

const app = express();

app.use(cors());
app.use(compression());
app.use(logger('tiny'));
// possibly express.raw
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/qa/questions', questionRoutes);
app.use('/api/qa/answers', answerRoutes)

module.exports = app;
