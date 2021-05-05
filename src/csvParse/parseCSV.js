const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');
const parseAnswer = require('./parseAnswer');
const parseQuestion = require('./parseQuestion');
const parsePhoto = require('./parsePhoto');

const parseCSV = (filePath, callback) => {
  let documents = [];
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(parse(
    { columns: true,
      trim: true,
      skip_empty_lines: true,
    }))
    .on('data', (results) => {
    readStream.pause()
    callback(null, results);
    readStream.resume();
  }).on('error', (err) => {
    callback(new Error(err), null);
  })
}

exports.parseCSV = parseCSV;

/* INITIAL SETUP OF DB */
/*
const parser = parse({ columns: true}, (err, results) => {
  console.error(err);
  console.log(results);
});
parseCSV(path.join(__dirname, '../dummyData/questions.csv'));
*/
