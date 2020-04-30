require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const projectId = process.env.INFURA_ID;
const mnemonic = process.env.KOVAN_MNEMONIC;

 module.exports = {
   networks: {

    kovan: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://kovan.infura.io/v3/${projectId}`
      ),
      networkId: 42,
      gasPrice: 10e9,
      gas: 5e6,
    }
   },
 };