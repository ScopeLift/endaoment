export function setWallet(state, wallet) {
  state.signer = wallet.signer;
  state.provider = wallet.provider;
  state.ethersProvider = wallet.ethersProvider;
  state.userAddress = wallet.userAddress;
}

export function setContractData(state, data) {
  state.endaomentFactory = data.contracts.factory;
  state.endaoments = data.endaoments;
}

export function setEndaoments(state, endaoments) {
  state.endaoments = endaoments;
}
