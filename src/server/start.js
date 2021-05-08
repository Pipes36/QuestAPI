const app = require('./server.js');
require('dotenv').config()
const port = process.env.PORT || 3000;
const db = require('../db/connection.js');

app.listen(port, () => {
  console.log(`Now listening to CORS-enabled server on port ${port}`);
});
