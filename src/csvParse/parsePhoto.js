const transform = require('./transform.js');

const parsePhoto = (photo = {}) => {
  return {
    id: transform.id(photo.id),
    'answer_id': transform.id(photo['answer_id']),
    url: transform.url(photo.url)
  }
};

module.exports = parsePhoto;
