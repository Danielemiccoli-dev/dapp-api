const express = require('express');
const cors = require('cors');
const { getResponse } = require('./redis');

const app = express();
app.use(cors());

app.get('', async (req, res) => {
  const response = getResponse();
  res.json({ "is_mint_active": (await response).active, "total_minted": (await response).minted});
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log('Server started on port 3002');
});
