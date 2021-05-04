const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');

const parseCSV = (filePath, parser) => {
  fs.createReadStream(filePath).pipe(parser);
}

exports.parseCSV = parseCSV;

/* INITIAL SETUP OF DB */
/*
const parser = parse({ columns: true}, (err, results) => {
  console.error(err);
  console.log(results);
});
parseCSV(path.join(__dirname, '../dummyData/questions.csv'), parser);
*/
