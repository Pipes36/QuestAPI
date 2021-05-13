const redis = require('redis');
require('dotenv').config();
const client = redis.createClient({
  url: process.env.REDIS_URL
});
const Promise = require('bluebird');

client.get = Promise.promisify(client.get);
client.set = Promise.promisify(client.set);

client.on('error', (err) => {
  console.error(err);
});
client.on('connect', async () => {
  await client.set('testkey', 'Successfully connected to Redis');
  const result = await client.get('testkey');
  console.log(result)
});
client.on('end', () => {
  client.flushall('ASYNC', () => {
    console.log('Flushed Redis Cache on Client End');
  });
});

module.exports = client;
