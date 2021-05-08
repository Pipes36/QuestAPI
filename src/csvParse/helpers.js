const parse = require('csv-parse/lib/sync');

module.exports = {
  // I: CSV; O: First row of CSV to be Column <String>
  determineColumns: (rows) => {
    try {
      return parse(rows, {
        to_line: 2
      })[0].join(',') + '\n';
    } catch (err) {
      console.log(err);
    }
  },
  // I: CSV; O: All rows transformed into objects <Array>
  transformRowsIntoObjects: (columns, rows, transformer) => {
    try {
      return parse(columns + rows, {
        columns: true,
        trim: true,
        skip_empty_lines: true,
        skip_lines_with_error: true,
      }).map((row) => transformer(row));
    } catch (err) {
      console.log(err);
    }
  }
};
