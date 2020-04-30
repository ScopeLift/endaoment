require('dotenv').config();
const infura_key = process.env.INFURA_ID;

module.exports = {
    node: {
      fork: `https://kovan.infura.io/v3/${infura_key}`,
      unlocked_accounts: [process.env.DAI_FUNDER],
      allowUnlimitedContractSize: true, // TODO remove the need for this
      gasLimit: 200e6,
    },
    contracts: {
      defaultGas: 200e6,
    },
  };
