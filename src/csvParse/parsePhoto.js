"use strict"
const transform = require('./transform.js');

const parsePhoto = (photo = {}) => {
  if (!photo.id && photo.id !== 0) return {};
  if (!photo['answer_id'] && photo['answer_id'] !== 0) return {};
  if (!photo.url) return {};
  return {
    // answer_id refs questions collection
    'answer_id': transform.id(photo['answer_id']),
    photo_id: transform.id(photo.id),
    url: transform.url(photo.url)
  }
};

module.exports = parsePhoto;
