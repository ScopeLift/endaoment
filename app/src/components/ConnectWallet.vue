<template>
  <div>
    <div>
      <q-btn
        color="primary"
        :label="label"
        :loading="isLoading"
        @click="connectWallet"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Onboard from 'bnc-onboard';

let provider;
const wallets = [
  { walletName: 'metamask' },
  { walletName: 'torus' },
  // { walletName: 'fortmatic', apiKey: process.env.FORTMATIC_API_KEY },
  { walletName: 'walletConnect', infuraKey: process.env.INFURA_ID },
  // { walletName: 'portis', apiKey: process.env.PORTIS_API_KEY },
  { walletName: 'coinbase' },
  { walletName: 'authereum' },
  { walletName: 'trust' },
  // { walletName: 'squarelink', apiKey: process.env.SQUARELINK_API_KEY },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'status' },
  { walletName: 'unilogin' },
  { walletName: 'dapper' },
];

export default {
  name: 'ConnectWallet',

  props: {
    label: {
      type: String,
      required: false,
      default: 'Connect Wallet',
    },
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {
    ...mapState({
      signer: (state) => state.main.signer,
      userAddress: (state) => state.main.userAddress,
    }),
  },

  methods: {
    async connectWallet() {
      try {
        this.isLoading = true;
        const onboard = Onboard({
          walletSelect: { wallets },
          dappId: process.env.BLOCKNATIVE_API_KEY,
          networkId: 999,
          darkMode: this.$q.dark.isActive,
          subscriptions: {
            wallet: (wallet) => { provider = wallet.provider; },
          },
        });
        await onboard.walletSelect();
        await onboard.walletCheck();
        await this.$store.dispatch('user/setEthereumData', provider);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
