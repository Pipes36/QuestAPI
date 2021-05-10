const moment = require('moment');

module.exports = () => {
  const startTime = Date.now();

  return () => {
    const timeElapsed = Date.now() - startTime;
    return moment.duration(timeElapsed).asMinutes;
  }
};
