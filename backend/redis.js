const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => {
    console.error('Redis error', err);
});

client.on('connect', async () => {
    console.log('Connected to Redis');
});
(async () => {
  await client.connect()
})()
module.exports = client;