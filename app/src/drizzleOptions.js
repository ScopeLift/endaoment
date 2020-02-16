import Web3 from "web3";
import Moloch from "./contracts/Moloch.json";

const options = {
  web3: {
    block: false,
    //customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [Moloch],
  events: {
    //SimpleStorage: ["StorageSet"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
