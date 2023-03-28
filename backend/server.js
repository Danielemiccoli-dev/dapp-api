const express = require('express');
const cors = require('cors');
const { getClient } = require('./redis');

const app = express();
app.use(cors());

app.get('', async (req, res) => {
  const redisClient = getClient();
  const isMintActive = await redisClient.get('isMintActive');
  const totalMinted = await redisClient.get('total_minted');
  res.json({ "is_mint_active": isMintActive, "total_minted": totalMinted});
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log('Server started on port 3002');
});
