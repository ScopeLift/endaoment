import { ethers } from 'ethers';

const { utils } = ethers;
const addresses = require('../../../../addresses.json');

const abi = {
  /* eslint-disable global-require */
  factory: require('../../../../build/contracts/EndaomentFactory.json').abi,
  endaoment: require('../../../../build/contracts/Endaoment.json').abi,
  dai: require('../../../../abi/dai.json').abi,
  cdai: require('../../../../abi/cdai.json').abi,
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

  const contracts = {
    factory: new ethers.Contract(addresses.factory, abi.factory, signer),
  };
  const endaoments = await contracts.factory.getEndaoments();

  commit('setContractData', { contracts, endaoments });
  commit('setWallet', {
    signer,
    provider,
    ethersProvider,
    userAddress,
  });
}

/**
 * @notice Get list of all endaoments
 */
export async function getEndaoments({ commit, state, dispatch }) {
  let provider = state.ethersProvider;
  if (!provider) {
    await dispatch('setDefaultEthereumData');
    provider = state.ethersProvider;
  }

  const factory = new ethers.Contract(addresses.factory, abi.factory, provider);
  const dai = new ethers.Contract(addresses.dai, abi.dai, provider);
  const endaomentsArray = await factory.getEndaoments();

  const endaoments = [];
  for (let i = 0; i < endaomentsArray.length; i += 1) {
    /* eslint-disable no-await-in-loop */
    const address = endaomentsArray[i];
    const endaoment = new ethers.Contract(address, abi.endaoment, provider);
    const bankAddress = await endaoment.guildBank();
    endaoments.push({
      id: i,
      address,
      bankAddress,
      bankBalance: parseInt(utils.formatEther(await dai.balanceOf(bankAddress)), 10),
      totalShares: (await endaoment.totalShares()).toString(),
      name: await endaoment.name(),
      description: await endaoment.description(),
    });
  }
  console.log(endaoments);

  commit('setEndaoments', endaoments);
}
