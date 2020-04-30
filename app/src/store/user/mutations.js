export function setWallet(state, wallet) {
  state.signer = wallet.signer;
  state.provider = wallet.provider;
  state.ethersProvider = wallet.ethersProvider;
  state.userAddress = wallet.userAddress;
}

export function setContractData(state, contracts) {
  state.endaomentFactory = contracts.factory;
}

export function setEndaoments(state, endaoments) {
  state.endaoments = endaoments;
}
