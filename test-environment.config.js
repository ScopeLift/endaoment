require('dotenv').config();
const infura_key = process.env.INFURA_ID;

module.exports = {
    node: {
      fork: `https://mainnet.infura.io/v3/${infura_key}`,
      unlocked_accounts: [process.env.DAI_FUNDER],
      gasLimit: 10e6,
    },
    contracts: {
      defaultGas: 5e6,
    },
  };
