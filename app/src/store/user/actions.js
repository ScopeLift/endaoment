import { ethers } from 'ethers';

const addresses = require('../../../../addresses.json');

const abi = {
  /* eslint-disable global-require */
  factory: require('../../../../build/contracts/EndaomentFactory.json').abi,
  endaoment: require('../../../../build/contracts/Endaoment.json').abi,
};


/**
 * @notice Used by default when loading app
 */
export async function setDefaultEthereumData({ commit }) {
  const ethersProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

  const contracts = {
    factory: new ethers.Contract(addresses.factory, abi.factory, ethersProvider),
  };

  const endaoments = await contracts.factory.getEndaoments();

  commit('setContractData', { contracts, endaoments });

  commit('setWallet', {
    signer: undefined,
    provider: undefined,
    ethersProvider,
    userAddress: undefined,
  });
}

/**
 * @notice Used when user connects a wallet
 */
export async function setEthereumData({ commit }, provider) {
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();
  const userAddress = await signer.getAddress();
  commit('setWallet', {
    signer,
    provider,
    ethersProvider,
    userAddress,
  });
}
