const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
const contract = require('../contract/easyzoom.json')
const Web3 = require('web3')
const providerUrl = "https://sepolia.infura.io/v3/ff526ca8ef12400d997abd0bd663bb00"
const web3 = new Web3(providerUrl);
const contractAddress = '0x043397eD44B63b8451caD77E9D8AbAD2492821eF'
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

const isMintState = async () => {
  const test = await nftContract.methods.whitelistMintState().call()
  return test

}
const getTotalMinted = async () => {
  const test = nftContract.methods.totalSupply().call()
  return test
}

const app = express();
app.use(cors());
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
setInterval(async () => {
    const minted = await getTotalMinted()
    const state = await isMintState()
    await client.set('total_minted', minted.toString())
    await client.set('isMintActive', state.toString())
}, 5000)


app.get('', async (req, res) => {
    const isMintActive = await client.get('isMintActive');
    const totalMinted = await client.get('total_minted');
    res.json({ "is_mint_active": isMintActive, "total_minted": totalMinted});
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log('Server started on port 3002');
});