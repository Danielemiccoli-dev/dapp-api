const express = require('express');
const cors = require('cors');
const contract = require('../contract/easyzoom.json')
const Web3 = require('web3')
const providerUrl = 'https://mainnet.infura.io/v3/ff526ca8ef12400d997abd0bd663bb00'
const web3 = new Web3(providerUrl);
const contractAddress = '0x8bcA6728966bE94907C4339965c45eE03cb25110'
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
const client = require('./redis');

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
